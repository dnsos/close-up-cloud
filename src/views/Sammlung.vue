<template>
	<div class="sammlung">
		<div class="menu" @click="$router.go(-1)">
			<span>Zurück zur Visualisierung</span>
		</div>
		<iframe :src="url"></iframe>
	</div>
</template>

<script>
export default {
	name: "sammlung",
	computed: {
		url: function() {
			return this.$store.getters
				.object(this.$route.params.id)
				.permalink.replace("https", "http");
		}
	}
};
</script>

<style lang="scss" scoped>
.menu {
	height: 50px;
	padding: 10px;
	cursor: pointer;
}
iframe {
	width: 100vw;
	height: calc(100vh - 50px);
	border: none;
}
</style>
