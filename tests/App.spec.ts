import AppComponent from '@/App.vue'
import { shallowMount } from '@vue/test-utils'
import { RouterView } from 'vue-router'

describe.concurrent('App Component', () => {
	const wrapper = shallowMount(AppComponent, {
		global: {
			stubs: ['Router-View'],
		},
	})

	it('renders a router-view', () => {
		expect(wrapper.findComponent(RouterView).exists()).toBeTruthy()
	})
})
