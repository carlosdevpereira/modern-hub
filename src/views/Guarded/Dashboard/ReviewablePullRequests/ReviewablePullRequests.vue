<template>
	<div class="reviewable-pull-requests">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<PullRequestRow
			v-for="pullRequest in pullRequests.orderedReviewablePullRequests"
			:key="pullRequest.id"
			:title="pullRequest.title"
			:number="pullRequest.number"
			:status="pullRequest.Status"
			:is-draft="pullRequest.draft"
			:reviewers="pullRequest.Reviewers"
			:html-url="pullRequest.html_url"
			:comments="pullRequest.CommentCount"
			:created-at="pullRequest.created_at"
			:author-tag="pullRequest.user?.login?.toString()"
			:author-avatar="pullRequest.user?.avatar_url?.toString()"
		/>
	</div>
</template>

<script lang="ts">
import { useNavigationStore } from '@/stores/NavigationStore';
import { usePullRequestStore } from '@/stores/PullRequestStore';
import { useRepositoryStore } from '@/stores/RepositoryStore';
import { defineComponent } from '@vue/runtime-core';
import { computed } from 'vue';
import PullRequestRow from './PullRequestRow.vue';

export default defineComponent({
	components: {
		PullRequestRow
	},

	setup() {
		const navigation = useNavigationStore();
		const repositoryStore = useRepositoryStore();
		const pullRequests = usePullRequestStore();
		const accessibleRepositories = computed(() => repositoryStore.repositories);

		return {
			navigation,
			pullRequests,
			accessibleRepositories,
		};
	},

	watch: {
		accessibleRepositories: {
			immediate: true,

			async handler(repositories) {
				if (this.navigation.workspace === "") return;

				this.pullRequests.reviewable = []

				await this.pullRequests.getReviewablePullRequests(
					this.navigation.workspace,
					repositories
				);
			}
		}
	}
})
</script>
