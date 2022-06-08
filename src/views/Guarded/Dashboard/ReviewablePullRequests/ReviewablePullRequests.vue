<template>
	<div class="reviewable-pull-requests">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

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
import { computed } from 'vue';
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

		const prioritySortedPullRequests = computed(() => {
			return [...pullRequests.value].sort((a, b) => {
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
			prioritySortedPullRequests
		};
	},
})
</script>
