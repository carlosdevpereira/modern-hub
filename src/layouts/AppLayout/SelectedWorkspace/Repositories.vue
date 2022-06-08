<template>
	<div class="workspace-repositories flex flex-col mb-3">
		<h3 class="text-xs uppercase tracking-tight m-0 p-5 pb-2">
			Repositories
		</h3>

		<router-link
			v-for="(repo) in repositoryStore.repositories"
			:key="repo.node.id"
			to="/"
			class="text-item decoration-none text-sm py-1 hover:bg-gray-100 color-gray-800 pl-5 flex items-center capitalize"
		>
			<Icon
				:name="repo.node.isPrivate ? 'git-repository-private-fill' : 'git-repository-line'"
				class="mr-2"
			/>

			{{ repo.node.name }}
		</router-link>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { useRepositoryStore } from '@/stores/RepositoryStore'
import { defineComponent } from '@vue/runtime-core'
import { computed } from 'vue'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()
		const repositoryStore = useRepositoryStore()

		const navigationProps = computed(() => {
			return {
				type: navigation.workspaceType,
				workspace: navigation.workspace,
				team: navigation.team
			}
		})

		return {
			currentUser,
			navigation,
			repositoryStore,

			navigationProps,
		}
	},

	watch: {
		navigationProps: {
			immediate: true,

			handler(navigation) {
				this.repositoryStore.repositories = []
				if (!navigation.workspace) return

				if(navigation.type === 'user') {
					this.repositoryStore.getUserRepositories(navigation.workspace)
				} else if (navigation.type === 'org') {
					if (!navigation.team) {
						this.
							repositoryStore.
							getOrganizationRepositories(navigation.workspace)
					} else {
						this.
							repositoryStore.
							getOrganizationTeamRepositories(navigation.workspace, navigation.team)
					}
				}
			}
		}
	},
})
</script>