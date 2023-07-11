import PullRequestRow from '@/views/Guarded/Dashboard/ReviewablePullRequests/PullRequestRow.vue';
import PullRequestFixture from '@tests/__fixtures__/PullRequestFixture.json';
import { shallowMount } from '@vue/test-utils';
import dayjs from 'dayjs';
import RelativeTimePlugin from 'dayjs/plugin/relativeTime';
dayjs.extend(RelativeTimePlugin)

const getWrapper = (props: object) => {
	const wrapper = shallowMount(PullRequestRow, {
		global: {
			mocks: {
				$route: {
					query: {}
				}
			},
			stubs: {
				Icon: true
			},
		},

		props
	})

	return wrapper
}

describe.concurrent('Pull request row', () => {
	const wrapper = getWrapper(PullRequestFixture)

	it('renders the avatar of the pull request author', () => {
		const authorAvatar = wrapper.get('img.pull-request-author-avatar')

		expect(authorAvatar.element.getAttribute('title')).toBe('author_tag')
		expect(authorAvatar.element.getAttribute('src')).toBe('author_avatar')
	})

	it('renders the tag of the pull request author', () => {
		const author = wrapper.get('.pull-request-author-tag')
		expect(author.text()).toBe("@author_tag")
	})

	it('renders the number of the pull request', () => {
		const pullRequestNumber = wrapper.get('.pull-request-number')
		expect(pullRequestNumber.text()).toContain(777)
	})

	it('renders the title of the pull request', () => {
		const pullRequestTitle = wrapper.get('.pull-request-title')
		expect(pullRequestTitle.text()).toBe("PR_title")
	})

	it('renders the status of the pull request', () => {
		const pullRequestStatus = wrapper.get('.pull-request-status')
		expect(pullRequestStatus.text()).toBe("changes_requested")
	})

	it('displays when the pull request was opened', () => {
		const relativeTime = dayjs().to(dayjs(PullRequestFixture.createdAt))
		const prDisplayRelativeTime = wrapper.get('.pull-request-relative-time')
		expect(prDisplayRelativeTime.text()).toContain(relativeTime)
	})

	it('displays information that the pull request is a draft', () => {
		const isDraft = wrapper.find('.pull-request-is-draft')
		expect(isDraft.exists()).toBe(true)
	})

	it('displays the count of comments left on the pull request', () => {
		const comments = wrapper.find('.pull-request-comments')

		expect(comments.exists()).toBe(true)
		expect(comments.get('.comments-count').text()).toBe("2")
	})

	it('displays a list of avatars from people that are reviewing the pull request', () => {
		const reviewers = wrapper.findAll('.pull-request-reviewer')

		expect(reviewers.length).toBe(4)
		expect(reviewers[0].element.getAttribute('title')).toBe('author_tag')
		expect(reviewers[1].element.getAttribute('title')).toBe('author_tag_1')
		expect(reviewers[2].element.getAttribute('title')).toBe('author_tag_2')
		expect(reviewers[3].element.getAttribute('title')).toBe('author_tag_3')
	})

	it('opens the pull request page when clicked', () => {
		window.open = vi.fn()

		const prRow = wrapper.get('.pull-request-row')
		prRow.trigger('click')

		expect(window.open).toHaveBeenCalled()
		expect(window.open).toHaveBeenCalledWith("http://example-gh-url.com", "_blank")
	})

	it('applies the correct row classes when changes are requested', async () => {
		await wrapper.setProps({ status: 'CHANGES_REQUESTED' })
		await wrapper.vm.$nextTick()

		const row = wrapper.get('.pull-request-row')

		expect(row.classes().includes('!bg-yellow-100')).toBe(true)
		expect(row.classes().includes('!hover:bg-yellow-200')).toBe(true)
	})
})
