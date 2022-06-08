import GithubApi from "@/api/graphql";
import GetOrganizationRepositories from '@/api/graphql/GetOrganizationRepositories.query';
import GetOrganizationTeamRepositories from '@/api/graphql/GetOrganizationTeamRepositories.query';
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

		async getOrganizationTeamRepositories(organization: string, team: string) {
			if (organization === '') throw new Error('Organization tag is required to retrieve repositories')

			const response = await GithubApi().query({
				query: GetOrganizationTeamRepositories,
				variables: {
					organization,
					team
				}
			})

			this.repositories = response.data.organization.team.repositories.edges
		},
	},
})
