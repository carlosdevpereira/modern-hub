import type { Endpoints } from "@octokit/types";
import { defineStore } from 'pinia';
import $Github from '../api';

type peopleItems = Endpoints["GET /orgs/{org}/members"]['response']['data']

export const usePeopleStore = defineStore({
	id: 'People',

	state: () => ({
		people: [] as peopleItems,
	}),

	getters: {},

	actions: {
		async getOrganizationMembers(organizationName: string) {
			if (organizationName === '') throw new Error('Organization name is required to retrieve its members')

			const response = await new $Github().request('GET /orgs/{org}/members', {
				org: organizationName,
				per_page: 100,
			})

			this.people = response.data
		},

		async getTeamMembers(organizationName: string, teamSlug: string) {
			if (organizationName === '') throw new Error('Organization name is required to retrieve its members')
			if (teamSlug === '') throw new Error('Team Slug is required to retrieve its members')

			const response = await new $Github().request('GET /orgs/{org}/teams/{team_slug}/members', {
				org: organizationName,
				team_slug: teamSlug,
				per_page: 100
			})

			this.people = response.data
		},
	},
})
