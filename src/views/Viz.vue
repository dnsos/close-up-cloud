<template>
  <main class="grid-viz">
    <div id="d3debug" />
    <pixi-renderer v-if="hasFetched" />
  </main>
</template>

<script>
import * as PIXI from 'pixi.js'
import PixiRenderer from '@/components/PixiRenderer.vue'

export default {
  name: 'grid-viz',
  components: {
    'pixi-renderer': PixiRenderer
  },
  data: function () {
    return {
      hasFetched: false
    }
  },
  mounted: function() {
    
    this.$store.dispatch('fetchData').then((data) => {
      this.hasFetched = true;
      console.log("data fetched", data)
    });
  }
}
</script>

<style scoped lang="scss">
.grid-viz {
  width: 100%;
  height: max-content;
  display: flex;
}
#d3debug {
  position: absolute; 
  transform-origin: top left;
  transform: scale(0.25);
  border: 8px solid #eee;
}
</style>
