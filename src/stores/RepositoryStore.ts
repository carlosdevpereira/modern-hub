import GithubApi from "@/api/graphql";
import GetOrganizationRepositories from '@/api/graphql/GetOrganizationRepositories.query';
import type { Repository } from '@/api/graphql/GetUserRepositories.query';
import GetUserRepositoriesQuery from '@/api/graphql/GetUserRepositories.query';
import { defineStore } from 'pinia';

export const useRepositoryStore = defineStore({
	id: 'Repositories',

	state: () => ({
		repositories: [] as Repository[],
	}),

	getters: {},

	actions: {
		async getUserRepositories(user: string) {
			if (user === '') throw new Error('User tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetUserRepositoriesQuery,
				variables: {
					user
				}
			})

			this.repositories = response.data.user.repositories.edges
		},

		async getOrganizationRepositories(organization: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetOrganizationRepositories,
				variables: {
					organization
				}
			})

			this.repositories = response.data.organization.repositories.edges
		},
	},
})
