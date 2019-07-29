<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <!-- canvas will be auto-injected by PIXI -->
    <div v-if="loading" class="loading-message">Bilder werden geladen ...</div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { appendCloseups } from '../utils/cloud'

export default {
  name: 'pixi-renderer',
  inject: ['PIXIApp'],
  data: function () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['imageData']),
    ...mapGetters(['taglist'])
  },
  methods: {
    handleLoaded: function () {
      console.log('Loading of resources complete')
      this.loading = false

      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')

      for (const tag of this.taglist) { cloudContainer.addChild(appendCloseups(tag, this.PIXIApp)) }

      console.log('stage:', this.PIXIApp.stage)
    }
  },
  mounted: function () {
    // resize renderer to whole canvas
    this.PIXIApp.renderer.autoResize = true
    this.PIXIApp.renderer.resize(this.$refs.rendererWrapper.offsetWidth, this.$refs.rendererWrapper.offsetHeight)

    // append PIXI.Application to wrapper
    document.querySelector('.renderer__wrapper').appendChild(this.PIXIApp.view)

    // create root containers for cloud/tag views and object view
    const cloudContainer = new PIXI.Container()
    cloudContainer.name = 'cloudContainer'
    const objectContainer = new PIXI.Container()
    objectContainer.name = 'objectContainer'

    this.PIXIApp.stage.addChild(cloudContainer, objectContainer)

    // load images into the texture cache
    this.PIXIApp.loader
      .add(this.imageData)
      .on('progress', handleProgress)
      .load(this.handleLoaded)

    function handleProgress(loader, resource) {
      // console.log('loading: ' + resource.name)
      // console.log('progress: ' + loader.progress + '%')
    }
  }
}
</script>

<style scoped lang="scss">
.renderer__wrapper {
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
