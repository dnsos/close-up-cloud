<template>
  <div class="sammlung">
    <div class="menu" @click="onclick">
      <span :class="[inverted]">Zurück zur Visualisierung</span>
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
    inverted: function() {
      return this.$store.state.inverted;
    },
    url: function() {
      return this.item ? this.item.permalink : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  height: 50px;
  padding: 10px;
  cursor: pointer;
  background: #fff;
  color: #887031;
}
iframe {
  width: 100vw;
  height: calc(100vh - 50px);
  border: none;
}
.inverted {
  // color: #fff;
}
</style>
