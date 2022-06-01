import RecentCommitsWithoutPullRequest from '@/views/Guarded/Dashboard/RecentCommitsWithoutPullRequest.vue'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useCommitStore } from '@/stores/CommitStore'

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

	it('applies container identifier class', () => {
		expect(wrapper.find(".recent-commits-without-pull-request").exists()).toBeTruthy()
	})

	it('renders the commits that do not have any pull request associated', async () => {
		const commitStore = useCommitStore()
		// Values that should be rendered
		commitStore.recentBranches = [{ name: 'dummy_branch_name', owner: 'dummy_owner', repo: 'dummy_repository' }]

		await wrapper.vm.$nextTick()
		const renderedItems = wrapper.findAll('.recent-branch')

		expect(renderedItems.length).toBe(1)
		expect(renderedItems[0].text()).toContain('You recently pushed dummy_branch_name branch to dummy_owner/dummy_repository')
		expect(renderedItems[0].find('.open-pull-request-button').exists()).toBeTruthy()
	})

	it('opens github page to create a new pull request', async () => {
		const commitStore = useCommitStore()
		commitStore.recentBranches = [{ name: 'dummy_branch_name', owner: 'dummy_owner', repo: 'dummy_repository' }]

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
})
