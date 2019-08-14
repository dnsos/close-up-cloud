<template>
  <div class="vizhtml">
    hello this is a single renderer
    <VizOverview />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import VizOverview from '@/components/VizOverview.vue'

export default {
  name: 'viz-renderer',
  components: { VizOverview },
  methods: {
      load() {
      },
      spreadTags() {
      },
      spreadCutouts() {
      },
      goToDetail() {
      }
  },
  mounted: function() {
    
    console.log("hello this is a renderer")
  }
}
</script>

<style scoped lang="scss">
.vizhtml {
    height: 100%;
    overflow: auto;
}
</style>
