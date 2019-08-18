<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Tag {{tag.title}}</router-link>

    <VizCloud :cloudname="tag.title" :items="cloudlist" :subpath="`/viz/detail`" />
  </div>
</template>

<script>
import VizCloud from '../components/VizCloud'
import { getCutoutUID } from '../utils.js'

export default {
  name: 'viz-tag',
  components: { VizCloud },
  props: {
    tag: {
      type: Object,
      default: function() {
        return this.$store.getters.tag(this.$route.params.id)
      }
    }
  },
  computed: {
    cloudlist: function() {

      //convert tag.occurrences to cloudlist (see readme)
      return this.tag.occurrences.map(occ => {

        //per occurencant object: sample all geometries
        const samples = occ.geometry.map(geo => {
          const sample = {
            origin: occ.origin,
            x: geo.x,
            y: geo.y
          }
          //@todo pass filename in a more elegant way
          sample.id = getCutoutUID(this.tag.title, sample);
          return sample;
        });

        return {
          id: occ.origin,
          weight: samples.length,
          samples: samples
        }
      })
    }
  },
  beforeMount: function() {
    console.log("hello this is a single tag cloud")
  },
  mounted: function() {
  },
  beforeDestroy: function() {
  }
}
</script>

<style scoped lang="scss">
</style>
