<template>
  <main class="grid-viz">
    <pixi-renderer />
  </main>
</template>

<script>
import * as PIXI from 'pixi.js'
import PixiRenderer from '@/components/PixiRenderer.vue'

export default {
  name: 'grid-viz',
  provide: function () {
    // initial settings for PIXI
    return {
      PIXIApp: new PIXI.Application({
        width: 800,
        height: 600,
        antialias: true,
        transparent: false,
        backgroundColor: 0xffffff,
        resolution: 1
      })
    }
  },
  components: {
    'pixi-renderer': PixiRenderer
  },
  data: function () {
    return {}
  },
  methods: {},
  created: function () {
    // check if WebGL is available
    const type = !PIXI.utils.isWebGLSupported() ? 'canvas' : 'WebGL'
    PIXI.utils.sayHello(type) 
  }
}
</script>

<style scoped lang="scss">
.grid-viz {
  width: 100%;
  height: max-content;
  display: flex;
}
</style>
