<template>
	<div
		class="pull-request-row rounded mb-1 pr-5 p-2 flex justify-between items-center bg-slate-100 divide-y cursor-pointer border-l-4 border-transparent hover:border-l-4 hover:border-blue-600 hover:-translate-x-1 hover:bg-slate-200 transition ease-in-out duration-100"
		:class="classes"
		@click="openPullRequest(htmlUrl)"
	>
		<div class="flex items-center">
			<img
				:src="authorAvatar"
				:title="authorTag"
				class="pull-request-author-avatar h-9 ml-1 mr-4 rounded"
			>

			<div class="flex flex-col justify-content-center">
				<div class="flex color-slate-400 items-center">
					<small
						v-if="isDraft"
						class="pull-request-is-draft text-xs font-extrabold tracking-wide mr-1 uppercase"
					>
						Draft
					</small>

					<small class="pull-request-number text-xs font-extrabold tracking-wide mr-2">#{{ number }}</small>

					<small
						v-if="status"
						class="pull-request-status capitalize font-bold mr-2"
					>
						{{ status.toLowerCase() }}
					</small>
				</div>

				<h2 class="pull-request-title text-sm capitalize m-0">
					{{ title }}
				</h2>

				<small class="text-xs">
					Opened
					<strong class="pull-request-relative-time">{{ timeSinceItWasCreated }}</strong>
					by <strong class="pull-request-author-tag">@{{ authorTag }}</strong>
				</small>
			</div>
		</div>

		<div class="flex items-center">
			<div class="-space-x-3 mr-2 items-center">
				<img
					v-for="(review, index) in reviewers"
					:key="index"
					:src="review.author.avatarUrl"
					:title="review.author.login"
					class="pull-request-reviewer relative w-7 h-7 ring-2 ring-gray-200 rounded-full dark:border-gray-800"
					:class="reviewerClasses(review, index)"
				>
			</div>

			<div
				v-if="comments > 0"
				class="pull-request-comments mr-4 relative"
			>
				<Icon
					name="discuss-line"
					class="text-xl"
				/>
				<span class="items-center flex justify-center absolute -bottom-0 -right-1 text-xs font-bold text-center w-3 h-3 bg-yellow-500 rounded-full">
					<small class="comments-count">{{ comments }}</small>
				</span>
			</div>

			<Icon name="external-link-line" />
		</div>
	</div>
</template>

<script lang="ts">
import type { PullRequestReviews } from '@/typings/Repository.type';
import type { PropType } from '@vue/runtime-core';
import { defineComponent } from '@vue/runtime-core';
import dayjs from 'dayjs';
import RelativeTimePlugin from 'dayjs/plugin/relativeTime';
import { uniqBy } from 'lodash';

dayjs.extend(RelativeTimePlugin)

const reviewersStatusOrder = ['CHANGES_REQUESTED', 'APPROVED', 'DISMISSED', 'COMMENTED']

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
			type: Object as PropType<PullRequestReviews>,
			default: () => ({})
		}
	},

	computed: {
		reviewers() {
			const sortedReviews = [...this.reviews.nodes].sort((a, b) => {
				if (b.updatedAt && a.updatedAt) {
					const bDate = new Date(b.updatedAt)
					const aDate = new Date(a.updatedAt)
					return bDate.getTime() - aDate.getTime();
				}

				return 0
			})

			const uniqueReviews = uniqBy(sortedReviews, (review) => {
				return review.author.login
			})

			const sortedReviewsByStatus = uniqueReviews.sort((a, b) => {
				if (reviewersStatusOrder.indexOf(b.state) > -1
					&& reviewersStatusOrder.indexOf(a.state) > -1) {
					return reviewersStatusOrder.indexOf(b.state)
						- reviewersStatusOrder.indexOf(a.state)
				}

				return 999
			})

			return sortedReviewsByStatus
		},

		timeSinceItWasCreated() {
			return dayjs().to(dayjs(this.createdAt))
		},

		classes() {
			let classes = []

			if (this.isDraft) classes.push('opacity-45')
			if (this.status === 'APPROVED') classes.push('!bg-green-100 !hover:bg-green-200')
			if (this.status === 'CHANGES_REQUESTED') classes.push('!bg-yellow-100 !hover:bg-yellow-200')

			return classes
		},

		reviewerClasses() {
			return (review: { state: string; }, index: number) => {
				let classes = []

				if (index < this.reviewers.length - 1) classes.push('scale-90')

				if (review.state === 'APPROVED') classes.push('ring-green-500')
				else if (review.state === 'CHANGES_REQUESTED') classes.push('ring-yellow-500')

				return classes
			}
		}
	},

	methods: {
		openPullRequest(pullRequestUrl: string) {
			window.open(pullRequestUrl, "_blank")
		}
	}
})
</script>
