<template>
	<div
		class="rounded mb-1 pr-5 p-2 flex justify-between items-center bg-slate-100 divide-y cursor-pointer border-l-4 border-transparent hover:border-l-4 hover:border-blue-600 hover:-translate-x-1 hover:bg-slate-200 transition ease-in-out duration-100"
		:class="{
			'opacity-45': isDraft,
			'!bg-green-100 !hover:bg-green-200': status === 'Approved',
			'!bg-yellow-100 !hover:bg-yellow-200': status === 'Changes requested',
		}"
		@click="openPullRequest(htmlUrl)"
	>
		<div class="flex items-center">
			<img
				:src="authorAvatar"
				class="h-9 ml-1 mr-4 rounded"
			>

			<div class="flex flex-col justify-content-center">
				<div class="flex color-slate-400 items-center">
					<small
						v-if="isDraft"
						class="text-xs font-extrabold tracking-wide mr-1 uppercase"
					>
						Draft
					</small>

					<small class="text-xs font-extrabold tracking-wide mr-2">#{{ number }}</small>

					<small
						v-if="status"
						class="capitalize font-bold mr-2"
					>
						{{ status.toLowerCase() }}
					</small>
				</div>

				<h2 class="text-sm capitalize m-0">
					{{ title }}
				</h2>

				<small class="text-xs">
					Opened
					<strong>{{ timeSinceItWasCreated }}</strong>
					by <strong>@{{ authorTag }}</strong>
				</small>
			</div>
		</div>

		<div class="flex items-center">
			<div class="-space-x-3 mr-2 items-center">
				<img
					v-for="(review, index) in reviews"
					:key="review.id"
					:src="review.user?.avatar_url"
					class="relative w-7 h-7 ring-2 ring-gray-200 rounded-full dark:border-gray-800"
					:class="{
						'ring-green-500': review.state === 'APPROVED',
						'ring-yellow-500': review.state === 'CHANGES_REQUESTED',
						'scale-90': index < reviews.length - 1
					}"
				>
			</div>

			<div
				v-if="comments > 0"
				class="mr-4 relative"
			>
				<Icon
					name="discuss-line"
					class="text-xl"
				/>
				<span class="items-center flex justify-center absolute -bottom-0 -right-1 text-xs font-bold text-center w-3 h-3 bg-yellow-500 rounded-full">
					<small>{{ comments }}</small>
				</span>
			</div>

			<Icon name="external-link-line" />
		</div>
	</div>
</template>

<script lang="ts">
import type { PullRequestReviews } from '@/stores/PullRequestStore';
import type { PropType } from '@vue/runtime-core';
import { defineComponent } from '@vue/runtime-core';
import dayjs from 'dayjs';
import RelativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTimePlugin)

export default defineComponent({
	props: {
		number: {
			type: Number,
			required: true
		},

		title: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			default: ''
		},

		isDraft: {
			type: Boolean,
			default: false
		},

		htmlUrl: {
			type: String,
			required: true
		},

		author: {
			type: String,
			default: ''
		},

		authorTag: {
			type: String,
			default: ''
		},

		authorAvatar: {
			type: String,
			default: ''
		},

		createdAt: {
			type: String,
			required: true
		},

		comments: {
			type: Number,
			default: 0
		},

		reviews: {
			type: Array as PropType<PullRequestReviews>,
			default: () => []
		}
	},

	computed: {
		timeSinceItWasCreated() {
			return dayjs().to(dayjs(this.createdAt))
		}
	},

	methods: {
		openPullRequest(pullRequestUrl: string) {
			window.open(pullRequestUrl, "_blank")
		}
	}
})
</script>
