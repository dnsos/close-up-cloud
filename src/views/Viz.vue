<template>
  <main class="grid-viz">
    <div id="d3force" style="position: absolute; transform-origin: top left;transform: scale(0.25);border: 8px solid #eee" />
    <pixi-renderer />
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
  /*data: function () {
    return {}
  },
  methods: {},
  created: function () {
    // check if WebGL is available
    const type = !PIXI.utils.isWebGLSupported() ? 'canvas' : 'WebGL'
    PIXI.utils.sayHello(type)
  }*/
}
</script>

<style scoped lang="scss">
.grid-viz {
  width: 100%;
  height: max-content;
  display: flex;
}
</style>
