<template>
	<div class="workspace-repositories flex flex-col mb-3">
		<h3 class="text-xs uppercase tracking-tight m-0 p-5 pb-2">
			Repositories
		</h3>

		<router-link
			v-for="(repo) in repositories.repositories"
			:key="repo.id"
			to="/"
			class="text-item decoration-none text-sm py-1 hover:bg-gray-100 color-gray-800 pl-5 flex items-center capitalize"
		>
			<Icon
				:name="repo.private ? 'git-repository-private-fill' : 'git-repository-line'"
				class="mr-2"
			/>

			{{ repo.name }}
		</router-link>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { useRepositoryStore } from '@/stores/RepositoryStore'
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()
		const repositories = useRepositoryStore()

		const navigationProps = computed(() => {
			return {
				workspace: navigation.workspace,
				team: navigation.team
			}
		})

		return {
			currentUser,
			navigation,
			repositories,

			navigationProps
		}
	},

	watch: {
		navigationProps: {
			immediate: true,

			handler(navigation) {
				this.repositories.repositories = []

				if (navigation.team !== '') {
					this.repositories.getTeamRepositories(navigation.workspace, navigation.team)
				} else if (navigation.workspace) {
					this.repositories.
						getRepositories(navigation.workspace, this.navigation.workspaceType)
				}
			}
		}
	},
})
</script>