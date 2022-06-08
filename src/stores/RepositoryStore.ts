import GithubApi from "@/api/graphql";
import GetOrganizationRepositories from '@/api/graphql/GetOrganizationRepositories.query';
import GetOrganizationTeamRepositories from '@/api/graphql/GetOrganizationTeamRepositories.query';
import GetUserRepositoriesQuery from '@/api/graphql/GetUserRepositories.query';
import type { PullRequest, Repository } from "@/typings/Repository.type";
import { defineStore } from 'pinia';

export const useRepositoryStore = defineStore({
	id: 'Repositories',

	state: () => ({
		repositories: [] as Repository[],
	}),

	getters: {
		pullRequestComments: () => (pullRequest: PullRequest) => {
			let pullRequestComments = pullRequest.comments.totalCount

			pullRequest.reviews.nodes.forEach((review) => {
				pullRequestComments += review.comments.totalCount
			})

			return pullRequestComments
		}
	},

	actions: {
		async getUserRepositories(user: string) {
			if (user === '') throw new Error('User tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetUserRepositoriesQuery,
				variables: {
					user
				}
			})

			const repositories: Repository[] = response.data.user.
				repositories.
				edges.
				flatMap((e: { node: Repository }) => e.node)

			this.repositories = repositories
		},

		async getOrganizationRepositories(organization: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetOrganizationRepositories,
				variables: {
					organization
				}
			})

			const repositories: Repository[] = response.data.organization.
				repositories.
				edges.
				flatMap((e: { node: Repository }) => e.node)

			this.repositories = repositories
		},

		async getOrganizationTeamRepositories(organization: string, team: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetOrganizationTeamRepositories,
				variables: {
					organization,
					team
				}
			})

			const repositories: Repository[] = response.data.organization.
				team.
				repositories.
				edges.
				flatMap((e: { node: Repository }) => e.node)

			this.repositories = repositories
		},
	},
})
