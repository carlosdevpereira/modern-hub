import GithubApi from "@/api/graphql";
import type { CurrentUser } from '@/api/graphql/GetCurrentUser.query';
import GetCurrentUserQuery from '@/api/graphql/GetCurrentUser.query';
import { defineStore } from 'pinia';

export const useCurrentUserStore = defineStore({
	id: 'CurrentUser',

	state: () => ({
		user: {} as CurrentUser,
	}),

	getters: {
		getOrganizationByName: state => (orgName: string) => {
			return state.
				user.
				organizations.
				nodes.
				find(organization => organization.login === orgName)
		},

		teams: state => {
			return state.user.
				organizations?.
				nodes.
				flatMap(organization => organization.teams.nodes)
		}
	},

	actions: {
		async getUser() {
			if (this.user.login) return

			const response = await GithubApi().query({
				query: GetCurrentUserQuery
			})

			this.user = response.data.viewer
		},
	},
})
