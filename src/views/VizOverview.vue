<template>
  <div class="overview">
    <router-link :to="`/viz/`">hello this is a tag overview</router-link>

    <VizCloud :cloudname="`overview`" :items="cloudItems" :subpath="`/viz/tag`" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import VizCloud from "../components/VizCloud";
import { getCutoutUID } from "../utils.js";

export default {
  name: "viz-overview",
  components: { VizCloud },
  computed: {
    ...mapState(["taglist"]),
    cloudItems: function() {
      //convert taglist to cloudItems (see readme)
      return this.taglist.map(tag => {
        //per tag: sample all occurrences (objects) by their first geometry
        const samples = tag.occurrences.map(occ => {
          return {
            id: getCutoutUID(
              occ.origin,
              tag.title,
              occ.geometry[0].x,
              occ.geometry[0].y
            )
          };
        });

        return {
          id: tag.title,
          weight: tag.tagCount,
          samples: samples
        };
      });
    }
  },
  beforeMount: function() {
    //console.log("hello this is a tag overview cloud")
  },
  mounted: function() {
    document.title = `Übersicht – Close-Up Cloud`;
    this.$store.dispatch("log", ["overview"]);
  },
  beforeDestroy: function() {
    document.title = `Close-Up Cloud`;
  }
};
</script>

<style scoped lang="scss">
</style>
