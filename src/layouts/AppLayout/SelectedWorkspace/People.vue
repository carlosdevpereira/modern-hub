<template>
	<div
		v-if="people.people.length"
		class="workspace-repositories flex flex-col mb-3"
	>
		<h3 class="text-xs uppercase tracking-tight m-0 p-5 pb-2">
			People
		</h3>

		<router-link
			v-for="person in people.people"
			:key="person.id"
			to="/"
			class="text-item decoration-none text-sm py-1 hover:bg-gray-100 color-gray-800 pl-5 flex items-center"
		>
			<img
				:src="person.avatar_url"
				class="mr-2 rounded w-5 h-5"
			>

			{{ person.login }}
		</router-link>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { usePeopleStore } from '@/stores/PeopleStore'
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()
		const people = usePeopleStore()

		const navigationProps = computed(() => {
			return {
				workspace: navigation.workspace,
				workspaceType: navigation.workspaceType,
				team: navigation.team
			}
		})

		return {
			currentUser,
			navigation,
			people,

			navigationProps
		}
	},

	watch: {
		navigationProps: {
			immediate: true,
			handler(navigation) {
				this.people.people = []

				if (navigation.team !== '') {
					this.people.getTeamMembers(navigation.workspace, navigation.team)
				} else if (navigation.workspace && navigation.workspaceType === 'org') {
					this.people.getOrganizationMembers(navigation.workspace)
				}
			}
		}
	},
})
</script>