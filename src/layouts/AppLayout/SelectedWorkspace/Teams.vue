<template>
	<div
		v-if="workspaceTeams.length"
		class="workspace-teams flex flex-col mb-3"
	>
		<h3 class="text-xs uppercase tracking-tight m-0 p-5 pb-2">
			Teams
		</h3>

		<router-link
			v-for="(team, index) in workspaceTeams"
			:key="index"
			:to="{
				name: 'WorkspaceTeamDashboard',
				params: {
					workspaceId: $route.params.workspaceId,
					teamSlug: team.slug
				}
			}"
			class="text-item decoration-none text-sm py-1 hover:bg-gray-100 color-gray-800 pl-5 flex items-center"
			:class="{'bg-sky-100 !hover:bg-sky-100 !color-sky-700': $route.params.teamSlug === team.slug}"
		>
			<img
				:src="organizationAvatar"
				class="mr-2 rounded w-4.5 h-4.5"
			>

			{{ team.name }}
		</router-link>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { useTeamStore } from '@/stores/TeamStore'
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()
		const teams = useTeamStore()

		const organizationAvatar = computed(() => {
			return currentUser.getOrganizationByName(navigation.workspace)?.avatar_url
		})

		const workspaceTeams = computed(() => {
			return teams.teams.filter(team => {
				return !!currentUser.teams.find(t => t.id === team.id)
			})
		})

		return {
			currentUser,
			navigation,
			teams,
			organizationAvatar,
			workspaceTeams
		}
	},

	watch: {
		'navigation.workspace': {
			immediate: true,
			handler(workspace) {
				if (this.navigation.workspaceType === 'org') {
					this.teams.getTeams(workspace)
				} else {
					this.teams.teams = []
				}
			}
		}
	},
})
</script>