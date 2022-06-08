import ReviewablePullRequests from '@/views/Guarded/Dashboard/ReviewablePullRequests/ReviewablePullRequests.vue'
import { createTestingPinia } from '@pinia/testing'
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

	it.todo('renders the pull requests that can be reviewed')

	it.todo('fetches reviewable pull requests when repositories change')
})
