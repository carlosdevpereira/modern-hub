<template>
	<Dropdown
		class="user-menu"
		theme="text"
		variant="secondary"
	>
		<template #button>
			<img
				:src="currentUser.user.avatarUrl"
				:alt="currentUser.user.login"
			>
		</template>

		<Button
			theme="text"
			class="mr-dropdown-option"
			@click="logout"
		>
			Logout
		</Button>
	</Dropdown>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()

		return { currentUser }
	},

	methods: {
		logout() {
			localStorage.removeItem('_access_token_')
			this.$router.push({ name: 'Login' })
		}
	}
})
</script>

<style lang="scss">
.mr-button:not([disabled='true']).size-md.user-menu {
	position: absolute;
	top: 50%;
	right: 0.5rem;
	padding: 0;
	border-radius: 50%;
	transform: translateY(-50%) !important;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
}
</style>
