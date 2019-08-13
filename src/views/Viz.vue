<template>
  <div class="view__viz grid__viz">
    <grid-header />
    <main class="grid-area__main">
      <div id="d3debug" />
      <pixi-renderer v-if="hasFetched" />
    </main>
    <grid-footer />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PixiRenderer from '@/components/PixiRenderer.vue'

export default {
  name: 'viz',
  components: {
    'grid-header': Header,
    'grid-footer': Footer,
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
.grid__viz {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 4rem minmax(0, 1fr) 4rem;
  grid-template-areas:
    "h h h h h h h h h h h h"
    "m m m m m m m m m m m m"
    "f f f f f f f f f f f f";
  grid-gap: 0;

  .grid-area__header { grid-area: h; }
  .grid-area__main { grid-area: m; }
  .grid-area__footer { grid-area: f; }
  .grid-area__header, .grid-area__footer {
    padding: calc(var(--grid-spacing)/4);
    >* { align-self: center; }
  }
  .grid-area__header, .grid-area__main, .grid-area__footer {
    transition: background-color 2s ease-in-out, color 2s ease-in-out;
  }
}
#d3debug {
  position: absolute; 
  transform-origin: top left;
  transform: scale(0.25);
  border: 8px solid #eee;
}
</style>
