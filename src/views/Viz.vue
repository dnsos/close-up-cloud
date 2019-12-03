<template>
  <div class="view__viz">
    <main class="layer__viz" ref="main">
      <VizRenderer v-if="dataFetched" />
    </main>
    <VizOverlay class="layer__overlay" v-if="dataFetched" />
  </div>
</template>

<script>
import VizRenderer from "@/components/VizRenderer.vue";
import VizOverlay from "@/components/VizOverlay.vue";

export default {
  name: "viz",
  components: { VizRenderer, VizOverlay },
  computed: {
    dataFetched: function() {
      return this.$store.state.dataFetched;
    }
  },
  mounted: function() {
    //console.log('Hello this is a Viz')

    //only ever fetch data once
    console.log("mkg", this.$route.path.startsWith("/mkg"));
    this.$store.state.isMkg = this.$route.path.startsWith("/mkg");
    if (this.dataFetched) return;

    this.$store.dispatch("fetchData").then(() => {
      this.$store.commit("setDataFetched");
    });
  }
};
</script>

<style lang="scss" scoped>
.view__viz {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.layer__viz {
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layer__overlay {
  z-index: 1;
}
</style>
