import type { Endpoints } from "@octokit/types";
import { defineStore } from 'pinia';
import $Github from '../api';

type GithubUser = Endpoints["GET /user"]['response']['data']
type UserTeams = Endpoints["GET /user/teams"]['response']['data']
type UserOrganizations = Endpoints["GET /user/orgs"]['response']['data']
type WatchedRepositories = Endpoints["GET /search/repositories"]['response']['data']['items']

export const useCurrentUserStore = defineStore({
	id: 'CurrentUser',

	state: () => ({
		currentUser: {} as GithubUser,
		watchedRepositories: [] as WatchedRepositories,
		organizations: [] as UserOrganizations,
		teams: [] as UserTeams
	}),

	getters: {
		userId: state => state.currentUser.id,
		tag: state => state.currentUser.login,
		avatar: state => state.currentUser.avatar_url,
		getOrganizationByName: state => (orgName: string) => {
			return state.organizations.find(organization => organization.login === orgName)
		}
	},

	actions: {
		async getUser() {
			if (this.currentUser.id) return

			const response = await new $Github().rest.users.getAuthenticated()
			this.currentUser = response.data
		},

		async getOrganizations() {
			const response = await new $Github().rest.orgs.listForAuthenticatedUser()

			this.organizations = response.data
		},

		async getTeams() {
			const userTeams = await new $Github().rest.teams.listForAuthenticatedUser()

			this.teams = userTeams.data
		},
	},
})
