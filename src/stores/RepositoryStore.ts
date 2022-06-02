import type { Endpoints } from "@octokit/types";
import { defineStore } from 'pinia';
import $Github from '../api';

type WorkspaceType = 'user' | 'org'

export type AccessibleRepositories = Endpoints["GET /search/repositories"]['response']['data']['items']

export const useRepositoryStore = defineStore({
	id: 'Repositories',

	state: () => ({
		repositories: [] as AccessibleRepositories,
	}),

	getters: {},

	actions: {
		async getRepositories(workspaceName: string, workspaceType: WorkspaceType = 'user') {
			if (workspaceName === '') throw new Error('Workspace name is required to retrieve repositories')

			const response = await new $Github().request('GET /search/repositories', {
				q: `${workspaceType}:${workspaceName}`,
				sort: 'updated',
				order: 'desc',
				per_page: 100
			})

			this.repositories = response.data.items
		},

		async getTeamRepositories(organizationName: string, teamSlug: string) {
			if (teamSlug === '') throw new Error('Team slug is required to retrieve repositories')

			const teamRepositoriesResponse = await new $Github().request('GET /orgs/{org}/teams/{team_slug}/repos', {
				org: organizationName,
				team_slug: teamSlug,
				per_page: 100
			})

			let currentPage = 1
			let isIncomplete = true
			const allRepos = [] as AccessibleRepositories

			do {
				const searchRepositories = await new $Github().request('GET /search/repositories', {
					q: `org:${organizationName}`,
					sort: 'updated',
					order: 'desc',
					page: currentPage,
					per_page: 100
				})

				allRepos.push(...searchRepositories.data.items.filter(repo => {
					return !!teamRepositoriesResponse.data.find(teamRepo => teamRepo.id === repo.id)
				}))

				if (searchRepositories.data.incomplete_results) {
					currentPage += 1
				} else {
					isIncomplete = false
				}

			} while (isIncomplete)

			this.repositories = allRepos
		},
	},
})
