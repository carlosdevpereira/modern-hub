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
	it.todo('renders the avatar of the pull request author')
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
