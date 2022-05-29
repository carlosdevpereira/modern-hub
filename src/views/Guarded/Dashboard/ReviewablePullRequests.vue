<template>
	<div class="recent-commits-without-pull-request">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<div
			v-for="pullRequest in pullRequests.orderedReviewablePullRequests"
			:key="pullRequest.id"
			class="rounded mb-1 pr-5 p-2 flex justify-between items-center bg-slate-100 divide-y cursor-pointer border-l-4 border-transparent hover:border-l-4 hover:border-blue-600 hover:-translate-x-1 hover:bg-slate-200 transition ease-in-out duration-100"
			:class="{
				'opacity-45': pullRequest.draft,
				'!bg-green-100 !hover:bg-green-200': pullRequests.pullRequestStatus(pullRequest.number) === 'Approved',
				'!bg-yellow-100 !hover:bg-yellow-200': pullRequests.pullRequestStatus(pullRequest.number) === 'Changes requested',
			}"
			@click="openPullRequest(pullRequest.html_url)"
		>
			<div class="flex items-center">
				<img
					:src="pullRequest.user?.avatar_url"
					class="h-9 ml-1 mr-4 rounded"
				>

				<div class="flex flex-col justify-content-center">
					<div class="flex color-slate-400 items-center">
						<small
							v-if="pullRequest.draft"
							class="text-xs font-extrabold tracking-wide mr-1 uppercase"
						>
							Draft
						</small>

						<small class="text-xs font-extrabold tracking-wide mr-2">#{{ pullRequest.number }}</small>

						<small
							v-if="pullRequests.pullRequestStatus(pullRequest.number)"
							class="capitalize font-bold mr-2"
						>
							{{ pullRequests.pullRequestStatus(pullRequest.number).toLowerCase() }}
						</small>
					</div>

					<h2 class="text-sm capitalize m-0">
						{{ pullRequest.title }}
					</h2>

					<small class="text-xs">
						Opened
						<strong>{{ fromNow(pullRequest.created_at) }}</strong>
						by <strong>@{{ pullRequest.user?.login }}</strong>
					</small>
				</div>
			</div>

			<div class="flex items-center">
				<div class="-space-x-3 mr-2 items-center">
					<img
						v-for="(review, index) in
							pullRequests.pullRequestReviewers(pullRequest.number)"
						:key="review.id"
						:src="review.user?.avatar_url"
						class="relative w-7 h-7 ring-2 ring-gray-200 rounded-full dark:border-gray-800"
						:class="{
							'ring-green-500': review.state === 'APPROVED',
							'ring-yellow-500': review.state === 'CHANGES_REQUESTED',
							'scale-90': index < pullRequests.pullRequestReviewers(pullRequest.number).length - 1
						}"
					>
				</div>

				<div
					v-if="pullRequests.pullRequestComments(pullRequest.number).length"
					class="mr-4 relative"
				>
					<Icon
						name="discuss-line"
						class="text-xl"
					/>
					<span class="items-center flex justify-center absolute -bottom-0 -right-1 text-xs font-bold text-center w-3 h-3 bg-yellow-500 rounded-full">
						<small>
							{{ pullRequests.pullRequestComments(pullRequest.number).length }}
						</small>
					</span>
				</div>

				<Icon name="external-link-line" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useNavigationStore } from '@/stores/NavigationStore';
import { usePullRequestStore } from '@/stores/PullRequestStore';
import { useRepositoryStore } from '@/stores/RepositoryStore';
import { computed } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import dayjs from 'dayjs';
import RelativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTimePlugin)

export default defineComponent({
	setup() {
		const navigation = useNavigationStore()
		const repositories = useRepositoryStore()
		const pullRequests = usePullRequestStore()

		const fromNow = (date: string) => dayjs().to(dayjs(date))
		const accessibleRepositories = computed(() => repositories.repositories)
		const openPullRequest = (pullRequest: string) => window.open(pullRequest, "_blank")

		return {
			navigation,
			repositories,
			pullRequests,

			fromNow,
			openPullRequest,
			accessibleRepositories,
		}
	},

	watch: {
		accessibleRepositories: {
			immediate: true,

			async handler() {
				if (this.navigation.workspace === '') return

				await this.pullRequests.getReviewablePullRequests()
			}
		}
	},
})
</script>
