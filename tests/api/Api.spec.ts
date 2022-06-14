import $Github from "@/api";

describe('Github API', () => {
	it('creates an instance of Octokit', () => {
		const GithubAPI = new $Github()
		expect(GithubAPI.instance).not.toBeUndefined()
		expect(GithubAPI.rest).not.toBeUndefined()
		expect(GithubAPI.request).not.toBeUndefined()
	})

	it('retrieves access token correctly', () => {
		vi.spyOn(window.localStorage.__proto__, 'getItem')

		new $Github()

		expect(window.localStorage.__proto__.getItem).toHaveBeenCalled()
		expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith('_access_token_')
	})

	it('sets the correct authentication details', async () => {
		const getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem')
		getItemSpy.mockImplementationOnce(() => 'MOCKED_ACCESS_TOKEN')

		const authInfo = await new $Github().instance.auth() as {
			type: string, token: string, tokenType: string
		}

		expect(authInfo.type).toBe('token')
		expect(authInfo.token).toBe('MOCKED_ACCESS_TOKEN')
		expect(authInfo.tokenType).toBe('oauth')
	})
})
