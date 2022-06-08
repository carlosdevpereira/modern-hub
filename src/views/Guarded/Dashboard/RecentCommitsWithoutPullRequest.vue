<template>
	<div class="recent-commits-without-pull-request">
		<div
			v-for="branch in commits.recentBranches"
			:key="branch.name"
			class="recent-branch mr-message variant-info mb-1"
		>
			<div class="mr-message-title !font-normal !flex-row !justify-between items-center !pr-0">
				<div>
					You recently pushed

					<strong>
						{{ branch.name }}
					</strong>
					branch to
					<strong>
						{{ branch.owner }}/{{ branch.repo }}
					</strong>.
				</div>

				<div class="flex">
					<Button
						class="open-pull-request-button"
						label="Open pull request"
						@click="openPullRequest(branch)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { RecentBranch } from '@/stores/CommitStore'
import { useCommitStore } from '@/stores/CommitStore'
import { useCurrentUserStore } from '@/stores/CurrentUserStore'
import { useNavigationStore } from '@/stores/NavigationStore'
import { useRepositoryStore, type AccessibleRepositories } from '@/stores/RepositoryStore'
import { defineComponent } from '@vue/runtime-core'
import { computed } from 'vue'

export default defineComponent({
	setup() {
		const currentUser = useCurrentUserStore()
		const navigation = useNavigationStore()
		const repositories = useRepositoryStore()
		const commits = useCommitStore()

		const accessibleRepositories = computed(() => repositories.repositories)

		return {
			currentUser,
			navigation,
			repositories,
			commits,

			accessibleRepositories,
		}
	},

	watch: {
		accessibleRepositories: {
			immediate: true,

			async handler(repositories) {
				await this.fetchBranches(repositories)
			}
		}
	},

	methods: {
		openPullRequest(branch: RecentBranch) {
			window.open(`https://github.com/${branch.owner}/${branch.repo}/compare/${branch.name}?expand=1`, "_blank")
		},

		async fetchBranches(repositories: AccessibleRepositories) {
			this.commits.recentBranches = []

			for (let index = 0; index < repositories.length; index++) {
				if (this.commits.recentBranches.length >= 5) break

				const repo = repositories[index];
				await this.commits.getRecentCommits(
					this.navigation.workspace,
					repo.name,
					this.currentUser.user.login
				)
			}
		}
	},
})
</script>
