<template>
	<Header-Layout-With-Sidebar
		fixed-header
		fixed-sidebar
		sidebar-filled
		class="app-layout"
	>
		<template #header>
			<App-Brand />

			<User-Menu v-if="currentUser.userId" />
		</template>

		<template #sidebar>
			Sidebar content
		</template>

		<Router-View />
	</Header-Layout-With-Sidebar>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { HeaderLayoutWithSidebar } from '@carlosdevpereira/mr-components'
import { defineComponent } from '@vue/runtime-core'
import AppBrand from './Brand.vue'
import UserMenu from './UserMenu.vue'

export default defineComponent({
	name: 'AppLayout',

	components: {
		HeaderLayoutWithSidebar,
		AppBrand,
		UserMenu,
	},

	setup() {
		const navigation = useNavigationStore()
		const currentUser = useCurrentUserStore()

		return {
			currentUser,
			navigation
		}
	},

	watch: {
		$route() {
			this.setNavigation()
		}
	},

	async created() {
		await this.currentUser.getUser()
		await this.currentUser.getTeams()

		this.setNavigation()
	},

	methods: {
		setNavigation() {
			if (!this.$route.params.workspaceId) {
				this.navigation.workspace = this.currentUser.tag
				this.navigation.workspaceType = 'user'
			} else {
				this.navigation.workspace = this.$route.params.workspaceId.toString()
				this.navigation.workspaceType = 'org'
			}

			if (this.$route.params.teamSlug) {
				this.navigation.team = this.$route.params.teamSlug.toString()
			}
			else {
				this.navigation.team = ''
			}
		}
	}
})
</script>

<style lang="scss">
@use 'sass:color';

@import '@/assets/scss/variables';

.app-layout {
	&.mr-header-layout {
		.mr-sidebar-layout {
			background-color: $whiteColor;
		}

		.mr-header {
			box-sizing: border-box;
			height: 60px;
			padding-top: 2.5px;
			padding-bottom: 2.5px;
			padding-left: 5px;
			color: $primaryInverse;
			background-color: $primaryColor;
		}

		.mr-sidebar {
			display: flex;
			width: 300px;
			padding: 0;
		}
	}
}
</style>