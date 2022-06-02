<template>
	<div class="recent-commits-without-pull-request">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<PullRequestRow
			v-for="pullRequest in pullRequests.orderedReviewablePullRequests"
			:key="pullRequest.id"
			:title="pullRequest.title"
			:number="pullRequest.number"
			:is-draft="pullRequest.draft"
			:html-url="pullRequest.html_url"
			:created-at="pullRequest.created_at"
			:author="pullRequest.user?.name?.toString()"
			:author-tag="pullRequest.user?.login?.toString()"
			:author-avatar="pullRequest.user?.avatar_url?.toString()"
			:status="pullRequests.pullRequestStatus(pullRequest.number)"
			:reviews="pullRequests.pullRequestReviewers(pullRequest.number)"
			:comments="pullRequests.pullRequestComments(pullRequest.number)"
		/>
	</div>
</template>

<script lang="ts">
import { useNavigationStore } from '@/stores/NavigationStore';
import { usePullRequestStore } from '@/stores/PullRequestStore';
import { useRepositoryStore } from '@/stores/RepositoryStore';
import { computed } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import PullRequestRow from './ReviewablePullRequests/PullRequestRow.vue';

export default defineComponent({
	components: { PullRequestRow },

	setup() {
		const navigation = useNavigationStore();
		const repositories = useRepositoryStore();
		const pullRequests = usePullRequestStore();
		const accessibleRepositories = computed(() => repositories.repositories);
		const openPullRequest = (pullRequest: string) => window.open(pullRequest, "_blank");
		return {
			navigation,
			repositories,
			pullRequests,
			openPullRequest,
			accessibleRepositories,
		};
	},

	watch: {
		accessibleRepositories: {
			immediate: true,
			async handler() {
				if (this.navigation.workspace === "") return;

				await this.pullRequests.getReviewablePullRequests();
			}
		}
	}
})
</script>
