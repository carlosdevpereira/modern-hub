import { useCommitStore } from '@/stores/CommitStore'
import { useRepositoryStore } from '@/stores/RepositoryStore'
import RecentCommitsWithoutPullRequest from '@/views/Guarded/Dashboard/RecentCommitsWithoutPullRequest.vue'
import { createTestingPinia } from '@pinia/testing'
import RepositoryFixture from '@tests/__fixtures__/RepositoryFixture.json'
import { shallowMount } from '@vue/test-utils'

describe.concurrent('Recent commits without pull request', () => {
	const wrapper = shallowMount(RecentCommitsWithoutPullRequest, {
		global: {
			plugins: [createTestingPinia()],

			stubs: {
				Button: true,
				Icon: true
			},
		},
	})

	const commitStore = useCommitStore()
	// Values that should be rendered
	commitStore.recentBranches = [{ name: 'dummy_branch_name', owner: 'dummy_owner', repo: 'dummy_repository' }]

	it('applies container identifier class', () => {
		expect(wrapper.find(".recent-commits-without-pull-request").exists()).toBeTruthy()
	})

	it('renders the commits that do not have any pull request associated', async () => {
		await wrapper.vm.$nextTick()
		const renderedItems = wrapper.findAll('.recent-branch')

		expect(renderedItems.length).toBe(1)
		expect(renderedItems[0].text()).toContain('You recently pushed dummy_branch_name branch to dummy_owner/dummy_repository')
		expect(renderedItems[0].find('.open-pull-request-button').exists()).toBeTruthy()
	})

	it('opens github page to create a new pull request', async () => {
		await wrapper.vm.$nextTick()
		const renderedItems = wrapper.findAll('.recent-branch')
		const openPullRequestButton = renderedItems[0].get('.open-pull-request-button')

		// Mock native window.open function
		const windowOpenFn = vi.fn()
		const originalWindowOpen = window.open
		window.open = windowOpenFn

		// Trigger window open
		await openPullRequestButton.trigger('click')

		expect(windowOpenFn).toHaveBeenCalled()
		expect(windowOpenFn).toHaveBeenCalledWith('https://github.com/dummy_owner/dummy_repository/compare/dummy_branch_name?expand=1', '_blank')

		// Restore window.open to its original value
		window.open = originalWindowOpen
	})

	it('fetches recent commits when accessible repositories change', async () => {
		const commitStore = useCommitStore()
		expect(commitStore.getRecentCommits).not.toHaveBeenCalled()

		const getRecentCommitsSpy = vi.spyOn(commitStore, 'getRecentCommits')
		// Simulates that there are a lot of branches for
		// a specific repository
		getRecentCommitsSpy.mockImplementationOnce(async (): Promise<{
			name: string;
			owner: string;
			repo: string;
		}[]> => {
			commitStore.recentBranches = [
				{ name: 'branch_1', owner: 'test_owner', repo: 'test_repo' },
				{ name: 'branch_2', owner: 'test_owner', repo: 'test_repo' },
				{ name: 'branch_3', owner: 'test_owner', repo: 'test_repo' },
				{ name: 'branch_4', owner: 'test_owner', repo: 'test_repo' },
				{ name: 'branch_5', owner: 'test_owner', repo: 'test_repo' },
				{ name: 'branch_6', owner: 'test_owner', repo: 'test_repo' },
			]

			return commitStore.recentBranches
		})

		// When the repositories are updated the
		// component must fetch the branches
		const repositoryStore = useRepositoryStore()
		repositoryStore.repositories = [RepositoryFixture, RepositoryFixture]

		await wrapper.vm.$nextTick()

		// There are 2 repositories but because the first
		// will get a lot of recent branches it only gets
		// called once (breaks out the loop)
		expect(commitStore.getRecentCommits).toHaveBeenCalledTimes(1)
	})
})
