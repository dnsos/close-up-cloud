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
import { preparePIXIApp } from '../js/preparePIXIApp'
import { appendCloseups } from '../js/appendCloseups'
import { hideUnselectedTags } from '../js/hideUnselectedTags'
import { spreadSelectedTag } from '../js/spreadSelectedTag'

export default {
  name: 'pixi-renderer',
  inject: ['PIXIApp'],
  data: function () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['resources', 'activeView', 'selection']),
    ...mapGetters(['taglist']),
    hoveredTag: function () {
      return this.$store.state.selection.tag.hovered
    }
  },
  methods: {
    handleLoaded: function () {

      console.timeEnd('Resource loading completeted in:')
      this.loading = false

      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')

      for (const tag of this.taglist) { cloudContainer.addChild(appendCloseups(tag, this.PIXIApp)) }

    }
  },
  watch: {
    activeView: function (newView, previousView) {

      if (newView === 'tag' && previousView === 'cloud') {

        console.log('Active view set to:', newView)

        const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')
        const selectedTag = cloudContainer.children.find(child => child.name === this.selection.tag.active)
        const unselectedTags = cloudContainer.children.filter(child => child.name != this.selection.tag.active)

        // set their visibility to false
        hideUnselectedTags(unselectedTags)
        spreadSelectedTag(selectedTag)

      }
    },
    hoveredTag: function (newTag, previousTag) {
      
      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')
      const hoveredContainer = cloudContainer.children.find(child => child.name === newTag)

      /*if (hoveredContainer) {
        const tagElement = hoveredContainer.children.find(child => child.text)
        tagElement.alpha = 1
      } else {
        console.log('No hovered tag') 
      }*/

    }
  },
  mounted: function () {

    // prepare PIXI
    preparePIXIApp(this.PIXIApp)

    // load images into the texture cache
    console.time('Resource loading completeted in:')
    this.PIXIApp.loader
      .add(this.resources)
      .on('progress', handleProgress)
      .load(this.handleLoaded)

    function handleProgress(loader, resource) {
      //console.log('loading: ' + resource.name)
      //console.log('progress: ' + loader.progress + '%')
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
