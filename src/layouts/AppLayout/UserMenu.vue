<template>
	<Button
		class="user-menu"
		theme="text"
	>
		<img
			:src="currentUser.avatar"
			:alt="currentUser.user.login"
		>
	</Button>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()

		return { currentUser }
	}
})
</script>

<style lang="scss">
.mr-button.size-md.user-menu {
	position: absolute;
	top: 10px;
	right: 1rem;
	padding: 0;
	border-radius: 50%;

	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
}
</style>