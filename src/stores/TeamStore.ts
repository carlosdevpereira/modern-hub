import type { Endpoints } from "@octokit/types";
import { defineStore } from 'pinia';
import $Github from '../api';

type UserTeams = Endpoints["GET /orgs/{org}/teams"]['response']['data']

export const useTeamStore = defineStore({
	id: 'Teams',

	state: () => ({
		teams: [] as UserTeams
	}),

	actions: {
		async getTeams(organization: string) {
			const response = await new $Github().request('GET /orgs/{organization}/teams', {
				organization
			})

			this.teams = response.data
			return this.teams
		},
	},
})
