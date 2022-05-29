import type { Endpoints } from '@octokit/types';
import { defineStore } from 'pinia';
import $Github from '../api';

export interface RecentBranch {
	name: string,
	owner: string,
	repo: string
}

type userEvents = Endpoints["GET /users/{username}/events"]['response']['data']

export const useCommitStore = defineStore({
	id: 'Commits',

	state: () => ({
		userEvents: [] as userEvents,
		recentBranches: [] as RecentBranch[]
	}),

	actions: {
		async getRecentCommits(owner: string, repo: string, author: string) {
			if (owner === '') throw new Error('The owner of the repository is required to retrieve recent commits')
			if (repo === '') throw new Error('The owner of the repository is required to retrieve recent commits')

			if (!this.userEvents.length) {
				const eventsResponse = await new $Github().request('GET /users/{username}/events', {
					username: author,
					per_page: 100
				})

				const events = eventsResponse.data.filter(e => {
					let ref = e.payload.ref
					if (ref && ref.startsWith('refs/heads/')) {
						ref = ref.split('refs/heads/')[1]
					}

					return (
						(e.type === 'PushEvent' || e.type === 'CreateEvent')
						&& ref !== 'master'
						&& ref !== 'main'
					)
				}).map(e => {
					if (e.payload.ref && e.payload.ref.startsWith('refs/heads/')) {
						e.payload.ref = e.payload.ref.split('refs/heads/')[1]
					}

					return e
				})

				this.userEvents = events
			}

			const sinceDate = new Date()
			sinceDate.setHours(sinceDate.getHours() - 2);

			for (let index = 0; index < this.userEvents.length; index++) {
				if (this.recentBranches.length === 5) break

				const event = this.userEvents[index];
				if (event.org && event.org?.login !== owner) continue
				if (event.repo.name !== `${owner}/${repo}`) continue

				const eventDate = new Date(`${event.created_at}`)
				if (eventDate < sinceDate) continue

				const pullRequestsResponse = await new $Github().request('GET /repos/{owner}/{repo}/pulls', {
					owner,
					repo,
					state: 'all',
					head: owner + ':' + event.payload.ref,
					per_page: 5,
				})

				if (pullRequestsResponse.data.length === 0) {
					this.recentBranches.push({
						name: event.payload.ref,
						owner,
						repo
					})
				}
			}

			return this.recentBranches
		},
	},
})
