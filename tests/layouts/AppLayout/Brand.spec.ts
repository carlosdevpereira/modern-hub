import Brand from "@/layouts/AppLayout/Brand.vue";
import { RouterLinkStub, shallowMount } from "@vue/test-utils";

describe('Brand', () => {
	const wrapper = shallowMount(Brand, {
		global: {
			stubs: {
				'router-link': RouterLinkStub
			}
		}
	})

	it('renders the modern-hub icon', () => {
		expect(wrapper.find('.modern-hub-icon').exists()).toBeTruthy();
	})
})