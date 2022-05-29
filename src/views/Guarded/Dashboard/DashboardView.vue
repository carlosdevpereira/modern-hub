<template>
	<main class="dashboard-view">
		<Recent-Commits-Without-Pull-Request />
	</main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import RecentCommitsWithoutPullRequest from './RecentCommitsWithoutPullRequest.vue'
export default defineComponent({
	name: "DashboardView",
	components: {
		RecentCommitsWithoutPullRequest,
	}
})
</script>

<style lang="scss" src="./Dashboard.scss"></style>