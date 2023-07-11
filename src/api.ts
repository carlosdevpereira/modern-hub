import { Octokit } from 'https://cdn.skypack.dev/@octokit/rest@19'
import type { Octokit as OctokitInstance } from 'octokit'

export interface Api {
	instance: OctokitInstance
	rest: OctokitInstance['rest']
	request: OctokitInstance['request']
}

export default class $Github implements Api {
	instance

	rest

	request

	constructor() {
		const accessToken = localStorage.getItem('_access_token_')
		this.instance = new Octokit({ auth: accessToken }) as OctokitInstance

		this.rest = this.instance.rest
		this.request = this.instance.request
	}
}
