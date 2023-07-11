import DashboardView from '@/views/Guarded/Dashboard/DashboardView.vue'
import RecentCommitsWithoutPullRequest from '@/views/Guarded/Dashboard/RecentCommitsWithoutPullRequest.vue'
import ReviewablePullRequests from '@/views/Guarded/Dashboard/ReviewablePullRequests/ReviewablePullRequests.vue'
import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'

describe.concurrent('Dashboard View', () => {
	const wrapper = shallowMount(DashboardView, {
		global: {
			plugins: [createTestingPinia()],
			mocks: {
				$route: {
					query: {}
				}
			},
			stubs: {
				RecentCommitsWithoutPullRequest,
				ReviewablePullRequests,

				Button: true,
				Icon: true
			},
		},
	})

	it('applies view identifier class', () => {
		expect(wrapper.find(".dashboard-view").exists()).toBeTruthy()
	})

	it('renders the recent commits without pull request component', () => {
		expect(wrapper.findComponent(RecentCommitsWithoutPullRequest).exists()).toBeTruthy()
	})

	it('renders the reviewable pull requests component', () => {
		expect(wrapper.findComponent(ReviewablePullRequests).exists()).toBeTruthy()
	})
})
