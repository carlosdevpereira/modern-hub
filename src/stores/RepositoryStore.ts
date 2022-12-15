import GithubApi from "@/api/graphql";
import GetOrganizationRepositories from '@/api/graphql/GetOrganizationRepositories.query';
import GetOrganizationTeamRepositories from '@/api/graphql/GetOrganizationTeamRepositories.query';
import GetUserRepositoriesQuery from '@/api/graphql/GetUserRepositories.query';
import type { PullRequest, Repository } from "@/typings/Repository.type";
import { defineStore } from 'pinia';

export const useRepositoryStore = defineStore({
	id: 'Repositories',

	state: () => ({
		loading: false,
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

			try {
				this.loading = true

				const response = await GithubApi().query({
					query: GetUserRepositoriesQuery,
					variables: {
						user
					}
				})

				const repositories: Repository[] = response.data.user.
					repositories.
					edges.
					flatMap((e: { node: Repository }) => {
						return { ...e.node, url: 'https://github.com/' + user + '/' + e.node.name }
					})

				this.repositories = repositories
			} finally {
				setTimeout(() => {
					this.loading = false
				}, 500)
			}
		},

		async getOrganizationRepositories(organization: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			try {
				this.loading = true

				const response = await GithubApi().query({
					query: GetOrganizationRepositories,
					variables: {
						organization
					}
				})

				const repositories: Repository[] = response.data.organization.
					repositories.
					edges.
					flatMap((e: { node: Repository }) => {
						return { ...e.node, url: 'https://github.com/' + organization + '/' + e.node.name }
					})

				this.repositories = repositories
			} finally {
				setTimeout(() => {
					this.loading = false
				}, 500)
			}
		},

		async getOrganizationTeamRepositories(organization: string, team: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			try {
				this.loading = true

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
					flatMap((e: { node: Repository }) => {
						return { ...e.node, url: 'https://github.com/' + organization + '/' + e.node.name }
					})

				this.repositories = repositories
			} finally {
				setTimeout(() => {
					this.loading = false
				}, 500)
			}
		},
	},
})
