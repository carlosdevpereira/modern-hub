<template>
	<aside class="workspaces mt-1">
		<router-link
			v-if="currentUser.user.login"
			to="/"
			class="workspace workspace-current-user"
			:class="{selected: isSelected(currentUser.user.login)}"
		>
			<img
				:src="currentUser.user.avatarUrl"
				:alt="currentUser.user.login"
				:title="`@${currentUser.user.login}`"
			>
		</router-link>

		<router-link
			v-for="organization in currentUser.user.organizations?.nodes"
			:key="organization.login"
			:to="{
				name: 'WorkspaceDashboard',
				params: { workspaceId: organization.login }
			}"
			class="workspace"
			:class="{selected: isSelected(organization.login)}"
		>
			<img
				:src="organization.avatarUrl"
				:alt="organization.login"
				:title="`@${organization.login}`"
			>
		</router-link>
	</aside>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()

		return {
			currentUser,
			navigation
		}
	},

	methods: {
		isSelected(workspace: string) {
			return workspace === this.navigation.workspace
		}
	}
})
</script>

<style lang="scss">
@use 'sass:color';

@import '@/assets/scss/variables';

.workspaces {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 60px;
	overflow: auto;
	background-color: $whiteColor;

	.workspace {
		position: relative;
		box-sizing: border-box;
		padding: 0.75rem 0;
		transition: background-color 300ms ease-in-out;

		&::before {
			position: absolute;
			top: 50%;
			left: -1.25rem;
			width: 15px;
			height: 20px;
			content: ' ';
			border-radius: $borderRadius;
			transition: background-color 250ms ease-in-out;
			transform: translateY(-50%);
		}

		img {
			height: 40px;
			border-radius: $borderRadius;
			transition: box-shadow 250ms ease-in-out;
		}

		&:hover {
			img {
				box-shadow: 0 3px 6px rgb(0 0 0 / 6%);
			}
		}

		&.selected {
			&::before {
				background-color: $primaryLighter;
			}

			img {
				box-shadow: 0 3px 6px rgb(0 0 0 / 6%);
			}
		}
	}
}
</style>