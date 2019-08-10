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
import { createCloseupBox } from '../js/appendCloseups'
import { hideUnselectedTags } from '../js/hideUnselectedTags'
import { spreadSelectedTag } from '../js/spreadSelectedTag'
import { appendObject } from '../js/appendObject'

export default {
  name: 'pixi-renderer',
  //inject: ['PIXIApp'],
  data: function () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['activeView', 'clouds', 'selection']),
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
      //console.log(this.PIXIApp.stage)

    }
  },
  watch: {
    activeView: function (newView, previousView) {

      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')
      const objectContainer = this.PIXIApp.stage.children.find(child => child.name === 'objectContainer')

      if (newView === 'tag' && previousView === 'cloud') {
        console.log('Active view set to:', newView)
        const selectedTag = cloudContainer.children.find(child => child.name === this.selection.tag.active)
        const unselectedTags = cloudContainer.children.filter(child => child.name != this.selection.tag.active)
        spreadSelectedTag(selectedTag, this.PIXIApp)
        hideUnselectedTags(unselectedTags)
      }
      
      else if (newView === 'object' && previousView === 'tag') {
        objectContainer.addChild(appendObject(this.selection.object.active, this.PIXIApp))
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
    

    this.loading = false

    const PIXIApp = new PIXI.Application({
      width: 640,
      height: 640,
      antialias: true,
      transparent: true,
      resolution: 1
    })
    //PIXIApp.renderer.autoResize = true
    //this.$store.commit('updateCanvasSize', initialCanvasSize)
    //PIXIApp.renderer.resize(store.state.canvas.width, store.state.canvas.height)

    // append PIXI.Application to wrapper
    this.$refs.rendererWrapper.appendChild(PIXIApp.view)

    // create root containers for cloud/tag views and object view
    const cloudContainer = new PIXI.Container()
    const objectContainer = new PIXI.Container()
    cloudContainer.name = 'cloudContainer'
    objectContainer.name = 'objectContainer'

    PIXIApp.stage.addChild(cloudContainer, objectContainer)

    this.$store.dispatch('computeForceLayout', this.taglist);

    for (const tag of this.taglist) { 
      // get coordinates from force layout
      const tagWithPositionData = this.$store.state.clouds.overview.find(el => el.title === tag.title)
      cloudContainer.addChild(createCloseupBox(tagWithPositionData)) 
    }

    /*var ticker = new PIXI.Ticker();
    ticker.add(() => {
      console.log('HI');
        //renderer.render(stage);
    }, PIXI.UPDATE_PRIORITY.LOW);
    ticker.start();*/

    // load images into the texture cache
    //console.time('Resource loading completeted in:')
    /*this.PIXIApp.loader
      .add(this.resources)
      .on('progress', handleProgress)
      .load(this.handleLoaded)*/

    //function handleProgress(loader, resource) {
      //console.log('loading: ' + resource.name)
      //console.log('progress: ' + loader.progress + '%')
    //}
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
