<template>
	<div class="reviewable-pull-requests">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<section class="flex mb-3">
			<Dropdown
				:label="enabledAuthorsLabel"
				theme="text-solid"
				variant="primary"
				:title="enabledAuthors.join(', \n')"
				:disabled="!pullRequestAuthors.length"
			>
				<Checkbox
					v-for="author in pullRequestAuthors"
					:key="author.login"
					v-model="pullRequestAuthorSelection[author.login]"
					:label="author.login"
				/>
			</Dropdown>
		</section>

		<PullRequestRow
			v-for="pullRequest in prioritySortedPullRequests"
			:key="pullRequest.number"
			:title="pullRequest.title"
			:number="pullRequest.number"
			:status="pullRequest.reviewDecision"
			:is-draft="pullRequest.isDraft"
			:reviews="pullRequest.reviews"
			:html-url="pullRequest.url"
			:comments="repositoryStore.pullRequestComments(pullRequest)"
			:created-at="pullRequest.createdAt"
			:author-tag="pullRequest.author.login"
			:author-avatar="pullRequest.author.avatarUrl"
		/>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { useRepositoryStore } from '@/stores/RepositoryStore';
import { defineComponent } from '@vue/runtime-core';
import { uniqBy } from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import PullRequestRow from './PullRequestRow.vue';

export default defineComponent({
	components: {
		PullRequestRow
	},

	setup() {
		const currentUser = useCurrentUserStore();
		const navigation = useNavigationStore();
		const repositoryStore = useRepositoryStore();
		const accessibleRepositories = computed(() => repositoryStore.repositories);

		const pullRequests = computed(() => {
			return repositoryStore.repositories.flatMap(r => r.pullRequests.nodes)
		})

		const pullRequestAuthors = computed(() => {
			return uniqBy(pullRequests.value.map(pr => pr.author), (author) => {
				return author.login
			}).sort((a, b) => {
				if (a.login.toLowerCase() < b.login.toLowerCase()) {
					return -1;
				}
				if (a.login.toLowerCase() > b.login.toLowerCase()) {
					return 1;
				}
				return 0;
			})
		})

		const pullRequestAuthorSelection: {
			[authorName: string]: boolean;
		} = reactive({})

		const currentRoute = useRoute()
		const enabledAuthors = computed(() => {
			if (currentRoute.query.authors) {
				currentRoute.query.authors?.toString().split(',').forEach((author) => {
					pullRequestAuthorSelection[author] = true
				})
			}

			return Object.
				keys(pullRequestAuthorSelection).
				filter(key => pullRequestAuthorSelection[key] === true).sort((a, b) => {
					if (a.toLowerCase() < b.toLowerCase()) {
						return -1;
					}
					if (a.toLowerCase() > b.toLowerCase()) {
						return 1;
					}
					return 0;
				})
		})

		const maxAuthorsInLabel = 2
		const enabledAuthorsLabel = computed(() => {
			if (enabledAuthors.value.length === 0) return 'Authors'
			if (enabledAuthors.value.length <= maxAuthorsInLabel) return enabledAuthors.value.join(', ')

			return enabledAuthors.value.slice(0, maxAuthorsInLabel).join(', ') + ` + ${enabledAuthors.value.length-maxAuthorsInLabel}`
		})

		const filteredPullRequests = computed(() => {
			if (!enabledAuthors.value.length) return pullRequests.value

			return pullRequests.value.filter(pr => enabledAuthors.value.includes(pr.author.login))
		})

		const prioritySortedPullRequests = computed(() => {
			return [...filteredPullRequests.value].sort((a, b) => {
				// Draft PR's always appear last
				if (b.isDraft) return -1
				else if (a.isDraft) return 1

				// Approved PR's reviewed by the current user
				if (b.reviewDecision === 'APPROVED' && (b.reviews.nodes && b.reviews.nodes.find(r => r.author.login === currentUser.user.login))) return -1
				if (a.reviewDecision === 'APPROVED' && (a.reviews.nodes && a.reviews.nodes.find(r => r.author.login === currentUser.user.login))) return 1

				// Pull Requests that are waiting for
				// the current user review specifically
				if (b.reviewRequests.nodes
					&& b.reviewRequests.nodes
						.filter(r => r.requestedReviewer.id)
						.find(r => r.requestedReviewer.login === currentUser.user.login)) return 1
				if (a.reviewRequests.nodes
					&& a.reviewRequests.nodes
						.filter(r => r.requestedReviewer.id)
						.find(r => r.requestedReviewer.login === currentUser.user.login)) return 1

				// Pull requests currently being reviewed by other people
				if ((repositoryStore.pullRequestComments(b) > 0) || (
					b.reviews.nodes
					&& !b.reviews.nodes.find(r => r.author.login === currentUser.user.login)
				)) return -1

				if ((repositoryStore.pullRequestComments(a) > 0) || (
					a.reviews.nodes
					&& !a.reviews.nodes.find(r => r.author.login === currentUser.user.login)
				)) return 1

				// Current user PR's
				if (b.author.login === currentUser.user.login) return -1
				else if (a.author.login === currentUser.user.login) return 1

				// Pull Requests that haven't been reviewed by anyone yet
				if (repositoryStore.pullRequestComments(b) === 0
					&& (!b.reviews.nodes || b.reviews.nodes.length === 0)) return -1
				else if (repositoryStore.pullRequestComments(a) === 0
					&& (!a.reviews.nodes || a.reviews.nodes.length === 0)) return 1

				return 0
			})
		})

		return {
			navigation,
			repositoryStore,
			accessibleRepositories,
			prioritySortedPullRequests,
			pullRequestAuthorSelection,
			pullRequestAuthors,
			enabledAuthors,
			enabledAuthorsLabel
		};
	},

	watch: {
		enabledAuthors(authors) {
			if (!authors) return
			const newAuthorsStr = authors.join(',')
			if (this.$route.query.authors === newAuthorsStr) return
			this.$router.replace({ query: { authors: newAuthorsStr } })
		}
	}
})
</script>
