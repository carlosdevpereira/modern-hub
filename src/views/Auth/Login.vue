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

		<template #right>
			<div class="mr-message text-sm">
				<div class="mr-message-title text-sm">
					How can you get a Personal Access Token?
					<small class="mr-message-body text-xs">
						To get a new Personal Access Token from Github, click on

						<a
							href="https://github.com/settings/tokens"
							target="_blank"
						>
							this link.
						</a> and follow the instructions below:

						<ul>
							<li>Click on "Generate new token" button.</li>
							<li>Give the token a name (Notes field).</li>
							<li>
								Select the following scopes:
								<strong>
									<ul>
										<li>repo (all)</li>
										<li>read:org</li>
										<li>write:org</li>
										<li>read:repo_hook</li>
										<li>admin:org_hook</li>
										<li>notifications</li>
										<li>user (all)</li>
									</ul>
								</strong>
							</li>
							<li>Press the "Generate token" button.</li>
						</ul>

						After generating a personal access token in Github, copy and paste it to the "Personal Access Token" field in this page and click the Sign In button.
					</small>
				</div>
			</div>

			<hr
				class="w-full"
				style="border-color: rgb(255 255 255 / 16%);"
			>

			<div class="mr-message max-w-80%">
				<div class="mr-message-title">
					Why do we need this?
					<small class="mr-message-body">We use this personal access token to show your organizations/workspaces, list your fellow team mates, list your repositories and to list your PR's and their respective review statuses.</small>
				</div>
			</div>
		</template>
	</Split-Layout>
</template>

<script lang="ts">
import { SplitLayout, ToastPlugin } from '@carlosdevpereira/mr-components'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
	name: 'LoginView',

	components: {
		SplitLayout
	},

	data() {
		return {
			personalAccessToken: '',
			showGuide: false
		}
	},

	methods: {
		signIn() {
			if (!this.personalAccessToken) {
				this.showGuide = true
				ToastPlugin.alert({ title: 'Github Access Token', message: 'An access token is required to interact with this platform.' })
				return
			}

			localStorage.setItem('_access_token_', this.personalAccessToken)
			this.$router.push({ name: 'Dashboard' })
		}
	}
})
</script>
