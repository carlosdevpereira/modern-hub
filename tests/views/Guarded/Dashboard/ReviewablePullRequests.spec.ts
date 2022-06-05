import { useNavigationStore } from '@/stores/NavigationStore'
import { usePullRequestStore } from '@/stores/PullRequestStore'
import { useRepositoryStore } from '@/stores/RepositoryStore'
import ReviewablePullRequests from '@/views/Guarded/Dashboard/ReviewablePullRequests.vue'
import PullRequestRow from '@/views/Guarded/Dashboard/ReviewablePullRequests/PullRequestRow.vue'
import { createTestingPinia } from '@pinia/testing'
import PullRequestFixture from '@tests/__fixtures__/PullRequestFixture.json'
import RepositoryFixture from '@tests/__fixtures__/RepositoryFixture.json'
import { shallowMount } from '@vue/test-utils'

describe.concurrent('Pull-request list', () => {
	const wrapper = shallowMount(ReviewablePullRequests, {
		global: {
			plugins: [createTestingPinia()],

			stubs: {
				Button: true,
				Icon: true
			},
		},
	})

	it('applies container identifier class', () => {
		expect(wrapper.find(".reviewable-pull-requests").exists()).toBeTruthy()
	})

	it('renders the pull requests that can be reviewed', async () => {
		const pullRequestStore = usePullRequestStore()
		// Values that should be rendered
		pullRequestStore.reviewable.push(PullRequestFixture)

		await wrapper.vm.$nextTick()
		const renderedItems = wrapper.findAllComponents(PullRequestRow)

		expect(renderedItems.length).toBe(1)
	})

	it('fetches reviewable pull requests when repositories change', async () => {
		const navigationStore = useNavigationStore()
		const pullRequestStore = usePullRequestStore()
		const repositoryStore = useRepositoryStore()

		navigationStore.workspace = 'test'
		expect(pullRequestStore.getReviewablePullRequests).not.toHaveBeenCalled()

		repositoryStore.repositories = [RepositoryFixture]
		await wrapper.vm.$nextTick()

		expect(pullRequestStore.getReviewablePullRequests).toHaveBeenCalledTimes(1)
	})
})
