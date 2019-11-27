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
			const dummyUrl =
				"http://sammlungonline.mkg-hamburg.de/de/object/Kaffeekanne/P2017.3.1185a/mkg-e00157089";
			const item = this.$store.getters.object(this.$route.params.id);
			return item ? item.permalink : dummyUrl;
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
