import PullRequestRow from '@/views/Guarded/Dashboard/ReviewablePullRequests/PullRequestRow.vue'
import { shallowMount } from '@vue/test-utils'

const getWrapper = (props: object) => {
	const wrapper = shallowMount(PullRequestRow, {
		global: {
			stubs: {
				Icon: true
			},
		},

		props
	})

	return wrapper
}

describe.concurrent('Pull request row', () => {
	it('renders the avatar of the pull request author', () => {
		const wrapper = getWrapper({ number: 1, title: 'test_pull_request', htmlUrl: 'pr_url', createdAt: '2022-06-06 13:53:00', authorAvatar: 'avatar_url', authorTag: 'author_tag' })
		expect(wrapper.find('.pull-request-author-avatar').exists()).toBe(true)
	})
	it.todo('renders the tag of the pull request author')
	it.todo('renders the number of the pull request')
	it.todo('renders the title of the pull request')
	it.todo('renders the status of the pull request')
	it.todo('displays when the pull request was opened')
	it.todo('displays information that the pull request is a draft')
	it.todo('displays the count of comments left on the pull request')
	it.todo('displays a list of avatars from people that are reviewing the pull request')
	it.todo('opens the pull request page when clicked')
})
