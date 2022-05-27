import { mount } from '@vue/test-utils'
import HomeView from '@/views/Home.vue'

describe('Home', () => {
	it('renders properly', () => {
		const wrapper = mount(HomeView)
		expect(wrapper.text()).toContain('Home View')
	})
})
