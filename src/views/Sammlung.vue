<template>
  <div class="sammlung">
    <div class="menu" @click="onclick">
      <span>Zurück zur Visualisierung</span>
    </div>
    <iframe :src="url"></iframe>
  </div>
</template>

<script>
export default {
  name: "sammlung",
  methods: {
    onclick: function() {
      // $router.go(-1)
      this.$router.push("/mkg/detail/" + this.item.id);
    }
  },
  computed: {
    item: function() {
      return this.$store.getters.object(this.$route.params.id);
    },
    url: function() {
      const dummyUrl =
        "https://sammlungonline.mkg-hamburg.de/de/object/Kaffeekanne/P2017.3.1185a/mkg-e00157089";
      return this.item ? this.item.permalink : dummyUrl;
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
