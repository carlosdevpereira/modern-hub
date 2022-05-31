import LoginView from '@/views/Auth/Login.vue'
import { mount } from '@vue/test-utils'

describe('Login View', () => {
	const routerPushFn = vi.fn()

	const wrapper = mount(LoginView, {
		global: {
			stubs: {
				Button: true,
				Input: true,
			},

			mocks: {
				$router: {
					push: routerPushFn
				}
			}
		},
	})

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders app title', () => {
		expect(wrapper.find("h2").text()).toBe('Modern Hub')
	})

	it('renders the personal-access-token input', () => {
		expect(wrapper.find(".personal-access-token-field").exists()).toBeTruthy()
	})

	it('renders the sign-in button', () => {
		expect(wrapper.find(".sign-in-button").exists()).toBeTruthy()
	})

	it('saves personal access token to local storage', () => {
		vi.spyOn(window.localStorage.__proto__, 'setItem')

		wrapper.setData({ personalAccessToken: 'PAT' })
		wrapper.find(".sign-in-button").trigger('click')

		expect(window.localStorage.__proto__.setItem).toHaveBeenCalled()
		expect(window.localStorage.__proto__.setItem).toHaveBeenCalledWith('_access_token_', 'PAT')
	})

	it('redirects the user to the dashboard', async () => {
		wrapper.setData({ personalAccessToken: 'PAT' })
		await wrapper.find(".sign-in-button").trigger('click')

		expect(routerPushFn).toHaveBeenCalledOnce()
		expect(routerPushFn).toHaveBeenCalledWith({ name: 'Dashboard' })
	})
})
