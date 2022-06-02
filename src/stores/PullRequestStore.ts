import type { Endpoints } from '@octokit/types';
import uniqBy from 'lodash/uniqBy';
import { defineStore } from 'pinia';
import $Github from '../api';
import { useNavigationStore } from './NavigationStore';
import { useRepositoryStore } from './RepositoryStore';

const reviewersStatusOrder = ['CHANGES_REQUESTED', 'APPROVED', 'DISMISSED', 'COMMENTED']

type PullRequests = Endpoints["GET /repos/{owner}/{repo}/pulls"]['response']['data']
export type PullRequestReviews = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['response']['data']

export interface Reviews {
	[number: number]: PullRequestReviews
}

export interface Comments {
	[number: number]: number
}

export const usePullRequestStore = defineStore({
	id: 'PullRequests',

	state: () => ({
		reviewable: [] as PullRequests,
		reviews: {} as Reviews,
		comments: {} as Comments,
		currentQuery: ''
	}),

	getters: {
		orderedReviewablePullRequests: (state) => {
			return state.reviewable.sort((a, b) => {
				const bDate = new Date(b.updated_at)
				const aDate = new Date(a.updated_at)
				return bDate.getTime() - aDate.getTime();
			});
		},

		pullRequestReviewers: (state) => (pullRequestNumber: number) => {
			const reviews = state.reviews[pullRequestNumber]
			if (!reviews) return []

			return uniqBy(state.reviews[pullRequestNumber].sort((a, b) => {
				if (b.submitted_at && a.submitted_at) {
					const bDate = new Date(b.submitted_at)
					const aDate = new Date(a.submitted_at)
					return bDate.getTime() - aDate.getTime();
				}

				return 0
			}), (review) => {
				return review.user?.id
			}).sort((a, b) => {
				if (reviewersStatusOrder.indexOf(b.state) > -1
					&& reviewersStatusOrder.indexOf(a.state) > -1) {
					return reviewersStatusOrder.indexOf(b.state)
						- reviewersStatusOrder.indexOf(a.state)
				}

				return 999
			})
		},

		pullRequestReviews: (state) => (pullRequestNumber: number) => {
			const reviews = state.reviews[pullRequestNumber]
			if (!reviews) return []

			return reviews
		},

		pullRequestComments: (state) => (pullRequestNumber: number) => {
			const comments = state.comments[pullRequestNumber]
			if (!comments) return 0

			return comments
		},

		pullRequestStatus(state) {
			return (pullRequestNumber: number): string => {
				const reviews = state.reviews[pullRequestNumber]
				if (!reviews) return ''

				const reviewers = this.pullRequestReviewers(pullRequestNumber)

				const isApproved = reviewers.filter(r => r.state !== 'APPROVED').length === 0
				const hasChangesRequested = reviewers.filter(r => r.state === 'CHANGES_REQUESTED').length > 0

				if (isApproved) return 'Approved'
				else if (hasChangesRequested) return 'Changes requested'
				return ''
			}
		}
	},

	actions: {
		async getReviewablePullRequests() {
			this.reviewable = []
			this.reviews = {}

			const navigation = useNavigationStore()
			if (navigation.workspace === '') throw new Error('The owner of the repository is required to retrieve recent commits')

			const repositories = useRepositoryStore()
			this.currentQuery = JSON.stringify(repositories.repositories)

			for (let index = 0; index < repositories.repositories.length; index++) {
				if (JSON.stringify(repositories.repositories) !== this.currentQuery) break

				const repo = repositories.repositories[index]
				const pullRequestsResponse = await new $Github().request('GET /repos/{owner}/{repo}/pulls', {
					owner: navigation.workspace,
					repo: repo.name,
					state: 'open',
					per_page: 100,
				})

				this.reviewable.push(...pullRequestsResponse.data)

				for (
					let indexReviews = 0;
					indexReviews < pullRequestsResponse.data.length;
					indexReviews++
				) {
					if (JSON.stringify(repositories.repositories) !== this.currentQuery) break

					const pullRequest = pullRequestsResponse.data[indexReviews]

					const reviews = await Promise.all([
						new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
							owner: navigation.workspace,
							repo: repo.name,
							pull_number: pullRequest.number,
							per_page: 100
						}),

						new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
							owner: navigation.workspace,
							repo: repo.name,
							pull_number: pullRequest.number,
							per_page: 100
						}),

						new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
							owner: navigation.workspace,
							repo: repo.name,
							pull_number: pullRequest.number
						}),
					])

					const pullRequestCommentActivity = reviews[1].data.length
					const pullRequestCommentCount = reviews[2].data.comments
					const pullRequestReviewCommentsCount = reviews[0].data.filter(r => r.body !== '').length

					this.comments[pullRequest.number]
						= pullRequestCommentActivity
						+ pullRequestCommentCount
						+ pullRequestReviewCommentsCount

					if (reviews[0].data.length > 0) {
						this.reviews[pullRequest.number] = reviews[0].data
					}
				}
			}
		},
	},
})
