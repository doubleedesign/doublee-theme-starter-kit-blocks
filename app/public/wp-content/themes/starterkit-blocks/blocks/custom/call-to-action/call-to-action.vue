<script lang="ts">
export default {
	data() {
		return {
		};
	},
};
</script>

<template>
	<slot></slot>
</template>

<style lang="scss">
@import '../../../scss/variables';
h2 {
	color: map-get($colours, 'primary');
}
</style>
