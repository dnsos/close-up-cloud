<template>
  <div class="view__viz">
    <div class="grid__viz">
      <VizHeader />
      <main class="grid-area__main">
        <VizRenderer v-if="hasFetched" />
      </main>
    </div>
    <VizOverlay />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import VizHeader from '@/components/VizHeader.vue'
import VizRenderer from '@/components/VizRenderer.vue'
import VizOverlay from '@/components/VizOverlay.vue'

export default {
  name: 'viz',
  components: { VizHeader, VizRenderer, VizOverlay },
  data: function () {
    return {
      hasFetched: false
    }
  },
  mounted: function() {
    console.log('Hello this is a Viz')
    
    this.$store.dispatch('fetchData').then((data) => {
      this.hasFetched = true;
    });
  }
}
</script>

<style lang="scss">

html,
body {
  overflow: hidden;
}

.grid__viz {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 4rem minmax(0, 1fr);
  grid-template-areas:
    "h h h h h h h h h h h h"
    "m m m m m m m m m m m m";
  grid-gap: 0;

  .grid-area__header {
    grid-area: h;
    padding: calc(var(--grid-spacing)/4);
    >* { align-self: center; }
  }

  .grid-area__main { grid-area: m; }

  .grid-area__header, .grid-area__main {
    transition: background-color 2s ease-in-out, color 2s ease-in-out;
  }
}
</style>
