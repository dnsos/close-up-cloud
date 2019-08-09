<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <!-- canvas will be auto-injected by PIXI -->
    <div v-if="loading" class="loading-message">Bilder werden geladen ...</div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TimelineMax, TweenMax } from 'gsap/TweenMax'
import PixiPlugin from 'gsap/PixiPlugin'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { preparePIXIApp } from '../js/preparePIXIApp'
import { appendCloseups } from '../js/appendCloseups'
import { hideUnselectedTags } from '../js/hideUnselectedTags'
import { spreadSelectedTag } from '../js/spreadSelectedTag'
import { appendObject } from '../js/appendObject'
import { durations } from '../js/variables'

PixiPlugin.registerPIXI(PIXI)

export default {
  name: 'pixi-renderer',
  inject: ['PIXIApp'],
  data: function () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['resources', 'activeView', 'cloud', 'selection', 'inverted']),
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
    inverted: function (newValue, previousValue) {

      // timeline that inverts all PIXI related objects; TODO: make backgroundColor work
      let tl = new TimelineMax()
      if (newValue === true) {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 1 } }) )
        //tl.add( TweenMax.to(this.PIXIApp.renderer, durations.invert, { pixi: { backgroundColor: 0x292929 } }) )
      } else {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 0 } }) )
        //tl.add( TweenMax.to(this.PIXIApp.renderer, durations.invert, { pixi: { backgroundColor: 0xffffff } }) )
      }
      tl.play()

    },
    activeView: function (newView, previousView) {

      // references to main containers
      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')
      const objectContainer = this.PIXIApp.stage.children.find(child => child.name === 'objectContainer')

      // from Cloud to Tag view
      if (newView === 'tag' && previousView === 'cloud') {
        const selectedTag = cloudContainer.children.find(child => child.name === this.selection.tag.active)
        const unselectedTags = cloudContainer.children.filter(child => child.name != this.selection.tag.active)
        hideUnselectedTags(unselectedTags)
        spreadSelectedTag(selectedTag, this.PIXIApp)
      }
      
      // from Tag to Object view
      else if (newView === 'object' && previousView === 'tag') {
        cloudContainer.visible = false
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

    // dispatch force layout when component has mounted
    this.$store.dispatch('handleDefineForceLayout', this.taglist)

    // set store's canvas size
    const initialCanvasSize = {
      width: this.$refs.rendererWrapper.offsetWidth,
      height: this.$refs.rendererWrapper.offsetHeight
    }
    this.$store.commit('updateCanvasSize', initialCanvasSize)

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
