<template>
	<Split-Layout inverse>
		<template #left>
			<div class="flex flex-col align-center justify-center max-w-sm mx-auto">
				<h2 class="mb-0">
					Modern Hub
				</h2>

				<p class="pb-5">
					Use a personal access token from Github to login.
				</p>

				<Input
					v-model="personalAccessToken"
					class="mt-3 personal-access-token-field"
					icon="key-2-line"
					type="password"
					label="Personal Access Token"
				/>

				<Button
					class="mt-3 sign-in-button"
					label="Sign In"
					icon="github-fill"
					@click="signIn"
				/>
			</div>
		</template>
	</Split-Layout>
</template>

<script lang="ts">
import { SplitLayout } from '@carlosdevpereira/mr-components'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	name: 'LoginView',

	components: {
		SplitLayout
	},

	data() {
		return {
			personalAccessToken: ''
		}
	},

	methods: {
		signIn() {
			if (this.personalAccessToken) {
				localStorage.setItem('_access_token_', this.personalAccessToken)
			}

			this.$router.push({ name: 'Dashboard' })
		}
	}
})
</script>
