import type { PullRequest } from '@/typings/PullRequest.type';
import uniqBy from 'lodash/uniqBy';
import { defineStore } from 'pinia';
import $Github from '../api';
import { useCurrentUserStore } from './CurrentUserStore';
import type { AccessibleRepositories } from './RepositoryStore';

type SortingSolutions = 'priority' | 'latest_updated' | 'oldest' | 'newest'

export const usePullRequestStore = defineStore({
	id: 'PullRequests',

	state: () => ({
		reviewable: [] as PullRequest[],
		sortedBy: 'priority' as SortingSolutions,
		currentQuery: ''
	}),

	getters: {
		prioritySort: (state) => {
			const currentUser = useCurrentUserStore()

			return state.reviewable.sort((a, b) => {
				// Draft PR's always appear last
				if (b.draft) return -1
				else if (a.draft) return 1

				// Approved PR's reviewed by the current user
				if (b.Status === 'Approved' && (b.Reviewers && b.Reviewers.find(r => r.user?.login === currentUser.user.login))) return -1
				if (a.Status === 'Approved' && (a.Reviewers && a.Reviewers.find(r => r.user?.login === currentUser.user.login))) return 1

				// Pull Requests that are waiting for
				// the current user review specifically
				if (b.requested_reviewers
					&& b.requested_reviewers.find(r => r.login === currentUser.user.login)) return 1
				if (a.requested_reviewers
					&& a.requested_reviewers.find(r => r.login === currentUser.user.login)) return 1

				// Pull requests currently being reviewed by other people
				if ((b.CommentCount && b.CommentCount > 0) || (
					b.Reviews
					&& !b.Reviews.find(r => r.user?.login === currentUser.user.login)
				)) return -1

				if ((a.CommentCount && a.CommentCount > 0) || (
					a.Reviews
					&& !a.Reviews.find(r => r.user?.login === currentUser.user.login)
				)) return 1

				// Current user PR's
				if (b.user?.login === currentUser.user.login) return -1
				else if (a.user?.login === currentUser.user.login) return 1

				// Pull Requests that haven't been reviewed by anyone yet
				if (b.CommentCount === 0
					&& (!b.Reviews || b.Reviews.length === 0)) return -1
				else if (a.CommentCount === 0
					&& (!a.Reviews || a.Reviews.length === 0)) return 1

				return 0
			});
		},

		orderedReviewablePullRequests(): PullRequest[] {
			// When sorting solution Select Field is implemented
			// alternate between the sorting function here

			return this.prioritySort
		},
	},

	actions: {
		async getPullRequests(owner: string, repo: string) {
			const { data } = await new $Github().request('GET /repos/{owner}/{repo}/pulls', {
				owner: owner,
				repo: repo,
				state: 'open',
				per_page: 100,
			})

			return data
		},

		async getPullRequestReviews(owner: string, repo: string, pullNumber: number) {
			const { data } = await new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
				owner: owner,
				repo: repo,
				pull_number: pullNumber,
				per_page: 100
			})

			return data
		},

		async getPullRequestComments(owner: string, repo: string, pullNumber: number) {
			const { data } = await new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
				owner: owner,
				repo: repo,
				pull_number: pullNumber,
				per_page: 100
			})

			return data
		},

		async getPullRequestDetails(owner: string, repo: string, pullNumber: number) {
			const { data } = await new $Github().request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
				owner: owner,
				repo: repo,
				pull_number: pullNumber
			})

			return data
		},

		resolvePullRequestReviewers(pullRequest: PullRequest) {
			if (!pullRequest.Reviews || pullRequest.Reviews.length === 0) return []

			const reviewersStatusOrder = ['CHANGES_REQUESTED', 'APPROVED', 'DISMISSED', 'COMMENTED']

			const sortedReviews = pullRequest.Reviews.sort((a, b) => {
				if (b.submitted_at && a.submitted_at) {
					const bDate = new Date(b.submitted_at)
					const aDate = new Date(a.submitted_at)
					return bDate.getTime() - aDate.getTime();
				}

				return 0
			})

			const uniqueReviews = uniqBy(sortedReviews, (review) => {
				return review.user?.id
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

		resolvePullRequestStatus(pullRequest: PullRequest) {
			if (!pullRequest.Reviewers || pullRequest.Reviewers.length === 0) return ''

			const isApproved = pullRequest.Reviewers.filter(r => r.state !== 'APPROVED').length === 0
			const hasChangesRequested = pullRequest.Reviewers.filter(r => r.state === 'CHANGES_REQUESTED').length > 0

			if (isApproved) return 'Approved'
			else if (hasChangesRequested) return 'Changes requested'
			return ''
		},

		async getReviewablePullRequests(owner: string, repositories: AccessibleRepositories) {
			if (owner === '') throw new Error('The owner of the repository is required')

			this.currentQuery = JSON.stringify(repositories)

			for (const repo of repositories) {
				if (JSON.stringify(repositories) !== this.currentQuery) break

				const pullRequests = await this.getPullRequests(owner, repo.name)

				this.reviewable.push(...pullRequests)

				for (const pullRequest of pullRequests) {
					if (JSON.stringify(repositories) !== this.currentQuery) break

					const reviews = await Promise.all([
						this.getPullRequestReviews(owner, repo.name, pullRequest.number),
						this.getPullRequestComments(owner, repo.name, pullRequest.number),
						this.getPullRequestDetails(owner, repo.name, pullRequest.number),
					])

					const reviewablePr = this.
						reviewable
						.find(reviewable => reviewable.id === pullRequest.id)

					if (reviewablePr) {
						if (reviews[0].length > 0) reviewablePr.Reviews = reviews[0]
						if (reviews[1].length > 0) reviewablePr.Comments = reviews[1]

						reviewablePr.Reviewers = this.resolvePullRequestReviewers(pullRequest)
						reviewablePr.Status = this.resolvePullRequestStatus(pullRequest)

						const pullRequestReviewCommentsCount = reviews[0].filter(r => r.body !== '').length
						const pullRequestCommentActivity = reviews[1].length
						const pullRequestCommentCount = reviews[2].comments

						reviewablePr.CommentCount
							= pullRequestReviewCommentsCount
							+ pullRequestCommentActivity
							+ pullRequestCommentCount
					}
				}
			}
		},
	},
})
