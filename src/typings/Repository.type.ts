export interface Repositories {
	node: Repository
}

export interface Repository {
	id: string
	name: string
	isPrivate: boolean
	pullRequests: { nodes: PullRequest[] }
	url: string
}

export interface PullRequest {
	baseRefName: string
	headRefName: string
	isDraft: boolean,
	number: number
	additions: number
	deletions: number
	repository: { name: string }
	reviewDecision: string
	title: string
	updatedAt: string
	createdAt: string
	url: string
	author: { avatarUrl: string, login: string }
	comments: { totalCount: number }
	participants: { totalCount: number, nodes: { avatarUrl: string, name: string }[] }
	reviews: PullRequestReviews
	reviewRequests: { nodes: { requestedReviewer: { id: string, name: string, login: string } }[] }
}

export interface PullRequestReviews {
	totalCount: number
	nodes: PullRequestReview[]
}

export interface PullRequestReview {
	state: string
	updatedAt: string
	authorAssociation: string
	author: { avatarUrl: string, login: string }
	comments: { totalCount: number }
}
