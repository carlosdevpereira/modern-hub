<template>
	<Header-Layout-With-Sidebar
		fixed-header
		fixed-sidebar
		sidebar-filled
		class="app-layout"
	>
		<template #header>
			<App-Brand />
		</template>

		<template #sidebar>
			Sidebar content
		</template>

		<Router-View />
	</Header-Layout-With-Sidebar>
</template>

<script lang="ts">
import { HeaderLayoutWithSidebar } from '@carlosdevpereira/mr-components'
import { defineComponent } from '@vue/runtime-core'
import AppBrand from './Brand.vue'

export default defineComponent({
	name: 'AppLayout',

	components: {
		HeaderLayoutWithSidebar,
		AppBrand,
	},
})
</script>

<style lang="scss">
@use 'sass:color';

@import '@/assets/scss/variables';

.app-layout {
	&.mr-header-layout {
		.mr-sidebar-layout {
			background-color: $whiteColor;
		}

		.mr-header {
			box-sizing: border-box;
			height: 60px;
			padding-top: 2.5px;
			padding-bottom: 2.5px;
			padding-left: 5px;
			color: $primaryInverse;
			background-color: $primaryColor;
		}

		.mr-sidebar {
			display: flex;
			width: 300px;
			padding: 0;
		}
	}
}
</style>