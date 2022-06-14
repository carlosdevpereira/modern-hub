import AsideWorkspaces from "@/layouts/AppLayout/AsideWorkspaces.vue";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useNavigationStore } from "@/stores/NavigationStore";
import { createTestingPinia } from "@pinia/testing";
import { RouterLinkStub, shallowMount } from "@vue/test-utils";

describe('Aside Workspaces', () => {
	const wrapper = shallowMount(AsideWorkspaces, {
		global: {
			plugins: [createTestingPinia()],

			stubs: {
				'router-link': RouterLinkStub
			}
		}
	})

	it('renders the workspaces aside element', () => {
		expect(wrapper.find('aside.workspaces').exists()).toBeTruthy();
	})

	it.todo('renders the workspaces available')

	it('applies selected class when a workspace is selected', async () => {
		const navigationStore = useNavigationStore()
		navigationStore.workspace = 'current_user_tag'

		const currentUser = useCurrentUserStore()
		currentUser.user.login = 'current_user_tag'

		await wrapper.vm.$nextTick()
		expect(wrapper.find('.workspace.selected').exists()).toBeTruthy();
	})
})