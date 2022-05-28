<template>
	<div class="selected-workspace-contents">
		<div
			v-if="currentUser.watchedRepositories.length"
			class="watching-repositories flex flex-col mb-5"
		>
			<h3 class="text-xs uppercase tracking-tight m-0 p-5 pb-2">
				Watching
			</h3>

			<router-link
				v-for="repo in currentUser.watchedRepositories"
				:key="repo.id"
				to="/"
				class="text-item decoration-none text-sm py-1 hover:bg-gray-100 color-gray-800 pl-5 flex items-center"
			>
				<img
					src="https://avatars.githubusercontent.com/u/21225529?s=200&v=4"
					class="mr-2 rounded w-5 h-5"
				>
				{{ repo.name }}
			</router-link>
		</div>

		<Workspace-Teams />

		<Workspace-Repositories />

		<Workspace-People />
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { defineComponent } from '@vue/runtime-core'
import WorkspacePeople from './SelectedWorkspace/People.vue'
import WorkspaceRepositories from './SelectedWorkspace/Repositories.vue'
import WorkspaceTeams from './SelectedWorkspace/Teams.vue'

export default defineComponent({
	components: {
		WorkspaceTeams,
		WorkspaceRepositories,
		WorkspacePeople
	},

	setup() {
		const currentUser = useCurrentUserStore()

		return {
			currentUser,
		}
	},
})
</script>

<style lang="scss">
@use 'sass:color';

@import '@/assets/scss/variables';

.selected-workspace-contents {
	box-sizing: border-box;
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: auto;
	color: $textColor;
	background-color: color.adjust($whiteColor, $lightness: -3%);
}
</style>