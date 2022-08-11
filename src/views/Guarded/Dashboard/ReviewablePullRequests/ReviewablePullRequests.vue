<template>
	<div class="reviewable-pull-requests">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<section class="flex mb-3">
			<Dropdown
				:label="selectedAuthorsLabel"
				theme="text-solid"
				variant="primary"
				:title="selectedAuthors.join(', \n')"
				:disabled="!pullRequestAuthors.length"
			>
				<Checkbox
					v-for="author in pullRequestAuthors"
					:key="author.login"
					:model-value="selectedAuthors?.includes(author.login)"
					:label="author.login"
					@update:model-value="(val:boolean) => authorSelected(author.login, val)"
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
			:comments="RepositoriesStore.pullRequestComments(pullRequest)"
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
import PullRequestRow from './PullRequestRow.vue';

export default defineComponent({
	components: {
		PullRequestRow
	},

	data() {
		return {
			RepositoriesStore: useRepositoryStore(),
			CurrentUserStore: useCurrentUserStore(),
			NavigationStore: useNavigationStore(),
		}
	},

	computed: {
		accessibleRepositories() {
			return this.RepositoriesStore.repositories
		},

		pullRequests() {
			return this.RepositoriesStore.repositories.flatMap(r => r.pullRequests.nodes)
		},

		pullRequestAuthors() {
			return uniqBy(this.pullRequests.map(pr => pr.author), (author) => {
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
		},

		selectedAuthors() {
			return this.$route.query.authors ? this.$route.query.authors.toString().split(',') : []
		},

		selectedAuthorsLabel() {
			const maxAuthorsInLabel = 2
			if (this.selectedAuthors.length === 0) return 'Authors'
			if (this.selectedAuthors.length <= maxAuthorsInLabel) return this.selectedAuthors.join(',')

			return this.selectedAuthors.slice(0, maxAuthorsInLabel).join(', ') + ` + ${this.selectedAuthors.length-maxAuthorsInLabel}`
		},

		filteredPullRequests() {
			if (!this.selectedAuthors.length) return this.pullRequests

			return this.pullRequests.filter(pr => this.selectedAuthors.includes(pr.author.login))
		},

		prioritySortedPullRequests() {
			return [...this.filteredPullRequests].sort((a, b) => {
				// Draft PR's always appear last
				if (b.isDraft) return -1
				else if (a.isDraft) return 1

				// Approved PR's reviewed by the current user
				if (b.reviewDecision === 'APPROVED' && (b.reviews.nodes && b.reviews.nodes.find(r => r.author.login === this.CurrentUserStore.user.login))) return -1
				if (a.reviewDecision === 'APPROVED' && (a.reviews.nodes && a.reviews.nodes.find(r => r.author.login === this.CurrentUserStore.user.login))) return 1

				// Pull Requests that are waiting for
				// the current user review specifically
				if (b.reviewRequests.nodes
					&& b.reviewRequests.nodes
						.filter(r => r.requestedReviewer.id)
						.find(r =>
							r.requestedReviewer.login
							=== this.CurrentUserStore.user.login)
				) return 1
				if (a.reviewRequests.nodes
					&& a.reviewRequests.nodes
						.filter(r => r.requestedReviewer.id)
						.find(r =>
							r.requestedReviewer.login
							=== this.CurrentUserStore.user.login)
				) return 1

				// Pull requests currently being reviewed by other people
				if ((this.RepositoriesStore.pullRequestComments(b) > 0) || (
					b.reviews.nodes
					&& !b.reviews.nodes.find(r =>
						r.author.login
						=== this.CurrentUserStore.user.login
					)
				)) return -1

				if ((this.RepositoriesStore.pullRequestComments(a) > 0) || (
					a.reviews.nodes
					&& !a.reviews.nodes.find(r =>
						r.author.login
						=== this.CurrentUserStore.user.login)
				)) return 1

				// Current user PR's
				if (b.author.login === this.CurrentUserStore.user.login) return -1
				else if (a.author.login === this.CurrentUserStore.user.login) return 1

				// Pull Requests that haven't been reviewed by anyone yet
				if (this.RepositoriesStore.pullRequestComments(b) === 0
					&& (!b.reviews.nodes || b.reviews.nodes.length === 0)) return -1
				else if (this.RepositoriesStore.pullRequestComments(a) === 0
					&& (!a.reviews.nodes || a.reviews.nodes.length === 0)) return 1

				return 0
			})
		},

	},

	methods: {
		authorSelected(author:string, selected: boolean) {
			if (selected) {
				const authorsToSave = [...this.selectedAuthors, author].join(',')
				this.$router.replace({ query: { authors: authorsToSave } })
			} else {
				const authorsToSave = this.selectedAuthors.filter(a => a !== author).join(',')
				this.$router.replace({ query: { authors: authorsToSave } })
			}
		}
	}
})
</script>
