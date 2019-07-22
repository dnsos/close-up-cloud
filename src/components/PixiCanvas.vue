<template>
  <div class="canvas__wrapper" ref="canvasWrapper">
    <!-- canvas will be auto-injected by PIXI -->
    <div v-if="loading" class="loading-message">Bilder werden geladen ...</div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'

export default {
  name: 'pixi-canvas',
  inject: ['app'],
  data: function () {
    return {
      loading: true
    }
  },
  methods: {
    init: function () {
      console.log('Setup complete')
      this.loading = false
      
      let sprite = new PIXI.Sprite(this.app.loader.resources['P2017.3.554'].texture)
      sprite.scale.set(0.1, 0.1)

      let stage = this.app.stage
      stage.addChild(sprite)
    },
    onResize: function (event) {
      // resize PIXI.Application
      this.app.renderer.resize(this.$refs.canvasWrapper.offsetWidth, this.$refs.canvasWrapper.offsetHeight)
    }
  },
  created: function () {
    window.addEventListener('resize', this.onResize)
  },
  mounted: function () {
    // before appending PIXI.Application: init autoResize and resize to initial dimensions
    this.app.renderer.autoResize = true
    this.app.renderer.resize(this.$refs.canvasWrapper.offsetWidth , this.$refs.canvasWrapper.offsetHeight)

    // append PIXI.Application to wrapper
    document.querySelector('.canvas__wrapper').appendChild(this.app.view)

    // load images into the texture cache
    this.app.loader
      .add([
        { name: 'P2017.3.398', url: './assets/test/P2017.3.398.jpg' },
        { name: 'P2017.3.410', url: './assets/test/P2017.3.410.jpg' },
        { name: 'P2017.3.553', url: './assets/test/P2017.3.553.jpg' },
        { name: 'P2017.3.554', url: './assets/test/P2017.3.554.jpg' },
        { name: 'P2017.3.576', url: './assets/test/P2017.3.576.jpg' },
        { name: 'P2017.3.617', url: './assets/test/P2017.3.617.jpg' }
      ])
      .on("progress", loadProgressHandler)
      .load(this.init)

    function loadProgressHandler(loader, resource) {
      // display the resource name currently being loaded
      console.log("loading: " + resource.name)
      // display the percentage of resources currently loaded
      console.log("progress: " + loader.progress + "%")
    }
  },
  destroyed: function () {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style scoped lang="scss">
.canvas__wrapper {
  width: 100%;
  height: 100%;
}

.loading-message {
  position: absolute;
  padding: calc(var(--grid-spacing)/4);
  top: 50%;
  left: 50%;
  background-color: rgba(0,0,0,0.1)
}
</style>
