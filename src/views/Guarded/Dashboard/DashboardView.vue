<template>
	<main class="dashboard-view">
		<Recent-Commits-Without-Pull-Request />

		<Reviewable-Pull-Requests />
	</main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import RecentCommitsWithoutPullRequest from './RecentCommitsWithoutPullRequest.vue'
import ReviewablePullRequests from './ReviewablePullRequests.vue'

export default defineComponent({
	name: "DashboardView",
	components: {
		RecentCommitsWithoutPullRequest,
		ReviewablePullRequests
	}
})
</script>

<style lang="scss" src="./Dashboard.scss"></style>