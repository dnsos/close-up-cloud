<template>
  <main class="grid-canvas">
    <pixi-canvas />
  </main>
</template>

<script>
import * as PIXI from 'pixi.js'
import PixiCanvas from '@/components/PixiCanvas.vue'

export default {
  name: 'grid-canvas',
  provide: function () {
    // initial settings for PIXI
    return {
      app: new PIXI.Application({
        width: 0,
        height: 0,
        antialias: true,
        transparent: true,
        resolution: 1
      })
    }
  },
  components: {
    'pixi-canvas': PixiCanvas
  },
  created: function () {
    // check if WebGL is available
    const type = !PIXI.utils.isWebGLSupported() ? 'canvas' : 'WebGL'
    PIXI.utils.sayHello(type)
  }
}
</script>

<style scoped lang="scss">
.grid-canvas {
  width: 100%;
  height: max-content;
  display: flex;
}
</style>
