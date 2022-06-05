<template>
	<Router-View />
</template>

<style lang="scss">
@import '@/assets/scss/variables';

html,
body,
#app {
	width: 100%;
	height: 100%;
	margin: 0;
}

#app {
	display: flex;
	align-items: center;
	justify-content: center;
}

::-webkit-scrollbar {
	width: 6px;
}

::-webkit-scrollbar-thumb {
	background: $primaryLighter;
}
</style>
