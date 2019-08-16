<template>
  <div class="view__viz grid__viz">
    <Header />
    <main class="grid-area__main">
      <VizRenderer v-if="hasFetched" />
    </main>
    <!--Footer /-->
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import VizRenderer from '@/components/VizRenderer.vue'

export default {
  name: 'viz',
  components: { Header, VizRenderer, Footer },
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
