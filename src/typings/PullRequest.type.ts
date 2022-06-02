import type { Endpoints } from '@octokit/types';

export type GithubPullRequest = Endpoints["GET /repos/{owner}/{repo}/pulls"]['response']['data'][0]
export type GithubPullRequestReview = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['response']['data'][0]
export type GithubPullRequestComment = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/comments']['response']['data'][0]

export interface PullRequest extends GithubPullRequest {
    Reviews?: GithubPullRequestReview[]
    Reviewers?: GithubPullRequestReview[]
    Comments?: GithubPullRequestComment[]
    CommentCount?: number
    Status?: string
}