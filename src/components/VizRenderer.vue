<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <div class="vizhtml">
      <router-link :to="`/viz`">
        hello this is a single renderer
      </router-link>
      <router-view />
    </div>
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { TweenLite } from 'gsap/TweenMax'
import { mapState } from 'vuex'
import { durations } from '../variables.js'

export default {
  name: 'viz-renderer',
  computed: mapState(['canvas', 'taglist', 'inverted']),
  watch: {
    $route(to, from) {
      //console.log('viz route changed', to, from);
    },
    inverted: function (newValue, previousValue) {
      const targetAlpha = (newValue === true) ? 1 : 0;
      TweenLite.to(this.PIXIApp.stage.filters[0], durations.invert, { alpha: targetAlpha, ease: Power1.easeInOut } )
    },
  },
  methods: {
    handleResize() {
      const { clientWidth: width, clientHeight: height } = this.$refs.rendererWrapper;
      this.$store.dispatch('updateCanvasSize', {width, height});
    },
      load() {
      },
      spreadTags() {
      },
      spreadCutouts() {
      },
      goToDetail() {
      }
  },
  beforeMount: function() {
    console.log("hello this is a renderer")

    this.PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: true,
      resolution: 1
    })

    this.viewport = new Viewport({
        screenWidth: 1280,
        screenHeight: 800,
        worldWidth: 1280,
        worldHeight: 1280,
        interaction: this.PIXIApp.renderer.plugins.interaction
    })
    .on('drag-start', () => {
      this.$store.commit('dragStart')
    })
    .on('drag-end', () => {
      this.$store.commit('dragEnd')
    })

    // init invert filter
    const colorMatrix = new PIXI.filters.ColorMatrixFilter()
    colorMatrix.negative()
    colorMatrix.alpha = 0
    this.PIXIApp.stage.filters = [colorMatrix]

    this.$store.commit('setPIXIApp', this.PIXIApp);
    this.$store.commit('setViewport', this.viewport);
  },
  mounted: function() {
    
    const wrap = this.$refs.rendererWrapper;
    wrap.appendChild(this.PIXIApp.view)
    this.PIXIApp.stage.addChild(this.viewport)
    
    
    this.viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()
        //.clamp({ direction: 'all' })
        
    //handle resize
    this.PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }
}
</script>

<style scoped lang="scss">
.vizhtml {
  display: none;  
    position: fixed;
    right: 0;
    width: 320px;
    height: 90vh;
    //transform: scale(0.25);
    transform-origin: top right;
    overflow: auto;
    padding: 8px;
    overflow: auto;
}
.renderer__wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-0);
  transition: background-color 2s ease-in-out;
}
</style>