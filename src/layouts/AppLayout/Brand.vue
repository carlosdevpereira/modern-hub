<template>
	<router-link
		to="/"
		class="modern-hub-icon decoration-none text-lg font-bold flex flex-col leading-none"
	>
		<span class="pt-1">
			M
		</span>

		<small class="text-xs font-light">Hub</small>
	</router-link>
</template>

<style lang="scss">
@use 'sass:color';

@import '@/assets/scss/variables';

.modern-hub-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 48px;
	color: $primaryInverse;
	background-color: $primaryHovering;
	border-radius: $borderRadius;
	transition: background-color 300ms ease-in-out;

	img {
		height: 35px;
	}

	&:hover {
		background-color: fade-out($primaryLighter, 0.5);
	}
}
</style>