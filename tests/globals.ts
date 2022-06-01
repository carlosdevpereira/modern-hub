import { OctokitPath, Octokit } from './__mocks__/Octokit'

vi.mock(OctokitPath, () => {
	return {
		Octokit: Octokit
	}
})
