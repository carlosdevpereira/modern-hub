import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest'
import type { Octokit as OctokitInstance } from 'octokit'

export default class $Github {
	rest

	request

	constructor() {
		const accessToken = localStorage.getItem('_access_token_')
		const octokit = new Octokit({ auth: accessToken }) as OctokitInstance

		this.rest = octokit.rest
		this.request = octokit.request
	}
}
