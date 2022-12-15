<template>
	<div class="reviewable-pull-requests">
		<h2 class="mt-0 text-xs uppercase tracking-tight">
			Reviews
		</h2>

		<section class="flex mb-3 gap-2 justify-between">
			<Dropdown
				:label="selectedAuthorsLabel"
				theme="text-solid"
				variant="primary"
				:title="selectedAuthors.join(', \n')"
				:disabled="!pullRequestAuthors.length"
			>
				<Checkbox
					v-for="author in pullRequestAuthors"
					:key="author.login"
					:model-value="selectedAuthors?.includes(author.login)"
					:label="author.login"
					@update:model-value="(val:boolean) => authorSelected(author.login, val)"
				/>
			</Dropdown>

			<div class="flex gap-2">
				<Dropdown
					:label="selectedSorting?.name || 'Sorting'"
					:title="selectedSorting?.title"
					theme="text-solid"
					variant="default"
				>
					<Checkbox
						v-for="(sorting, index) in availableSortingMethods"
						:key="index"
						:model-value="selectedSortingMethod === sorting.key"
						:label="sorting.name"
						:title="sorting.title"
						@update:model-value="(val:string) => updateSortingMethod(sorting.key)"
					/>
				</Dropdown>

				<Button
					theme="text-solid"
					variant="secondary"
					class="!text-lg !font-bold"
					@click="refreshPullRequestList"
				>
					<Icon name="refresh-line" />
				</Button>
			</div>
		</section>

		<Spinner v-if="isLoading" />

		<template v-else>
			<PullRequestRow
				v-for="(pullRequest, index) in sortedPullRequests"
				:key="index"
				:title="pullRequest.title"
				:number="pullRequest.number"
				:repository-name="pullRequest.repository.name"
				:status="pullRequest.reviewDecision"
				:is-draft="pullRequest.isDraft"
				:reviews="pullRequest.reviews"
				:html-url="pullRequest.url"
				:comments="RepositoriesStore.pullRequestComments(pullRequest)"
				:created-at="pullRequest.createdAt"
				:author-tag="pullRequest.author.login"
				:author-avatar="pullRequest.author.avatarUrl"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { useRepositoryStore } from '@/stores/RepositoryStore';
import { defineComponent } from '@vue/runtime-core';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import PullRequestRow from './PullRequestRow.vue';

export default defineComponent({
	components: {
		PullRequestRow
	},

	data() {
		return {
			RepositoriesStore: useRepositoryStore(),
			CurrentUserStore: useCurrentUserStore(),
			NavigationStore: useNavigationStore()
		}
	},

	computed: {
		isLoading() {
			return this.RepositoriesStore.loading
		},

		accessibleRepositories() {
			return this.RepositoriesStore.repositories
		},

		availableSortingMethods() {
			return [
				{ name: 'Author', key: 'author', title: 'Order by author name' },
				{ name: 'Repository', key: 'repository', title: 'Order by repository name' },
				{ name: 'Oldest First', key: 'oldest', title: 'Pull requests opened for a long time will appear first. (Aka it\'s time to close this 💩)' },
				{ name: 'Smallest First', key: 'smallest', title: 'Pull requests without many changes will appear first. (The little the better)' },
				{ name: 'Most Interacted With', key: 'most_interacted_with', title: 'Pull requests with more comments will appear first. (Aka: where the fun is 🔥)' },
				{ name: 'Best Sorting', key: 'best_sorting', title: 'Pull requests will be ordered by a specific set of rules tailored to maximize productivity.\n\n(Pull requests that are pending your intervention directly will appear first, followed by pull requests that weren\'t reviewed by anyone yet, followed by pull requests that are already being reviewed, followed by approved pull requests in general, then by your own approved pull requests and the drafts will always appear last)' },
			]
		},

		selectedSorting() {
			return this.availableSortingMethods.find(
				sortingMethod => sortingMethod.key === this.selectedSortingMethod
			)
		},

		pullRequests() {
			return this.RepositoriesStore.repositories.flatMap(r => r.pullRequests.nodes)
		},

		pullRequestAuthors() {
			return uniqBy(this.pullRequests.map(pr => pr.author), (author) => {
				return author.login
			}).sort((a, b) => {
				if (a.login.toLowerCase() < b.login.toLowerCase()) {
					return -1;
				}
				if (a.login.toLowerCase() > b.login.toLowerCase()) {
					return 1;
				}
				return 0;
			})
		},

		selectedAuthors() {
			return this.$route.query.authors ? this.$route.query.authors.toString().split(',') : []
		},

		selectedSortingMethod() {
			return this.$route.query.sortBy ? this.$route.query.sortBy.toString() : 'best_sorting'
		},

		selectedAuthorsLabel() {
			const maxAuthorsInLabel = 2
			if (this.selectedAuthors.length === 0) return 'Authors'
			if (this.selectedAuthors.length <= maxAuthorsInLabel) return this.selectedAuthors.join(',')

			return this.selectedAuthors.slice(0, maxAuthorsInLabel).join(', ') + ` + ${this.selectedAuthors.length-maxAuthorsInLabel}`
		},

		filteredPullRequests() {
			if (!this.selectedAuthors.length) return this.pullRequests

			return this.pullRequests.filter(pr => this.selectedAuthors.includes(pr.author.login))
		},

		sortedPullRequests() {
			if (this.selectedSortingMethod === 'author') return this.authorSortedPullRequests
			if (this.selectedSortingMethod === 'repository') return this.repositorySortedPullRequests
			else if (this.selectedSortingMethod === 'oldest') return this.logevitySortedPullRequests
			else if (this.selectedSortingMethod === 'smallest') return this.smallestSortedPullRequests
			else if (this.selectedSortingMethod === 'most_interacted_with') return this.mostInteractedWithPullRequests
			else if (this.selectedSortingMethod === 'best_sorting') return this.prioritySortedPullRequests

			else return this.prioritySortedPullRequests
		},

		authorSortedPullRequests() {
			return orderBy(this.filteredPullRequests, (pr) => pr.author.login.toLowerCase())
		},

		repositorySortedPullRequests() {
			return orderBy(this.filteredPullRequests, (pr) => pr.repository.name.toLowerCase())
		},

		logevitySortedPullRequests() {
			return orderBy(this.filteredPullRequests, 'createdAt')
		},

		smallestSortedPullRequests() {
			return orderBy(this.filteredPullRequests, (pr) => {
				return pr.additions + pr.deletions
			})
		},

		mostInteractedWithPullRequests() {
			const orderedList = orderBy(this.filteredPullRequests, [(pullRequest) => {
				return this.RepositoriesStore.pullRequestComments(pullRequest)
			}], 'desc')

			return orderedList
		},

		prioritySortedPullRequests() {
			return orderBy(this.filteredPullRequests, pullRequest => {
				// Draft pr's
				if (pullRequest.isDraft) return -1
				// Pull requests from current user already approved
				if (pullRequest.author.login === this.CurrentUserStore.user.login && pullRequest.reviewDecision === 'APPROVED') return 0
				// Pull requests awaiting for my review specifically
				if ((pullRequest.reviewRequests.nodes
					&& pullRequest.reviewRequests.nodes
						.filter(r => r.requestedReviewer.id)
						.find(r =>
							r.requestedReviewer.login
							=== this.CurrentUserStore.user.login)
				) || (pullRequest.author.login === this.CurrentUserStore.user.login && pullRequest.reviewDecision === 'CHANGES_REQUESTED')) return 5
				// Pull requests not reviewed by anyone yet
				if (!pullRequest.reviews.nodes || pullRequest.reviews.nodes.length === 0) return 4
				// Pull requests approved already
				if (pullRequest.reviewDecision === 'APPROVED') return 1
				// Pull requests from the current user
				if (pullRequest.author.login === this.CurrentUserStore.user.login) return 2
				// Pull requests being reviewed by someone else already
				if ((this.RepositoriesStore.pullRequestComments(pullRequest) > 0) || (
					pullRequest.reviews.nodes
					&& !pullRequest.reviews.nodes.find(r =>
						r.author.login
						=== this.CurrentUserStore.user.login
					))) return 3
			}, 'desc')
		},

	},

	methods: {
		updateQuery({ authors, sortBy }: { authors: string, sortBy: string }) {
			this.$router.replace({ query: { authors, sortBy } })
		},

		authorSelected(author:string, selected: boolean) {
			if (selected) {
				const authorsToSave = [...this.selectedAuthors, author].join(',')
				this.updateQuery({ authors: authorsToSave, sortBy: this.selectedSortingMethod })
			} else {
				const authorsToSave = this.selectedAuthors.filter(a => a !== author).join(',')
				this.updateQuery({ authors: authorsToSave, sortBy: this.selectedSortingMethod })
			}
		},

		refreshPullRequestList() {
			if(this.NavigationStore.workspaceType === 'user') {
				this.RepositoriesStore.getUserRepositories(this.NavigationStore.workspace)
			} else if (this.NavigationStore.workspaceType === 'org') {
				if (!this.NavigationStore.team) {
					this.RepositoriesStore.getOrganizationRepositories(
						this.NavigationStore.workspace
					)
				} else {
					this.RepositoriesStore.getOrganizationTeamRepositories(
						this.NavigationStore.workspace,
						this.NavigationStore.team
					)
				}
			}
		},

		updateSortingMethod(selectedSortingMethod: string) {
			this.updateQuery({ authors: this.selectedAuthors.join(','), sortBy: selectedSortingMethod })
		}
	}
})
</script>
