<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <div class="vizhtml">
      <router-link :to="`/viz`">
        hello this is a single renderer
      </router-link>
      <router-view /> <!-- here goes VitOverview, VizTag, VizDetail via router -->
      <VizTransition />
      <VizInput />
    </div>
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { TweenLite, Power1, Power2 } from 'gsap/TweenMax'
import { mapState } from 'vuex'
import VizTransition from './VizTransition.vue'
import VizInput from './VizInput.vue'
import { durations, minZoomFactor, maxZoomFactor } from '../variables.js'
import EventBus from '../eventbus.js';

export default {
  name: 'viz-renderer',
  computed: mapState(['canvas', 'world', 'taglist', 'inverted', 'vizTransition']),
  components: { VizTransition, VizInput },
  data: () => {
    return {
      PIXIApp: null,
      viewport: null,
      vizContainer: null,
      debugContainer: null,
      //helper object for "camera" transitions
      camera: { x: 0, y: 0, zoom: 0.5 }, 
    };
  },
  watch: {
    inverted: function (newValue, previousValue) {
      const targetAlpha = (newValue === true) ? 1 : 0;
      TweenLite.to(this.PIXIApp.stage.filters[0], durations.invert, { alpha: targetAlpha, ease: Power1.easeInOut } )
    },
    vizTransition: function() {
      //this.moveToPoint(); //viz transition - move viewport to center
    },
    world: function(newval) {
      console.log('VizRenderer: world changed', newval);

      //this.updateDebugGrid();
    }
  },
  methods: {
    handleResize() {

      //@todo bugfix: sometimes while resizing browser says "Cannot read property 'clientWidth' of undefined" – wtf?
      if(!this.$refs.rendererWrapper) return;
      
      const { clientWidth, clientHeight } = this.$refs.rendererWrapper;

      this.PIXIApp.renderer.resize(clientWidth, clientHeight);
      this.vizContainer.position.set(clientWidth/2, clientHeight/2);
      this.$store.dispatch('updateCanvasSize', {
        width: clientWidth, 
        height: clientHeight});

      //@debug show viewport grid
      //this.updateDebugGrid();
    },
    /*moveToPoint(point) {
      //default screen center
      if(!point) point = {x: this.viewport.worldWidth/2, y: this.viewport.worldHeight/2};

      TweenLite.to(this.camera, 1, { 
        x: point.x, 
        y: point.y,
        onUpdate: () => {
          this.viewport.moveCenter(this.camera.x, this.camera.y);
        },
        ease: Power2.easeOut
      })
    },*/
    /*zoomToBBox(boundingBox) {
    },*/
    zoomIn() {

      let desiredZoom = this.camera.zoom + (this.camera.zoom/4);
      desiredZoom = Math.min(desiredZoom, 1);
      TweenLite.to(this.camera, durations.mouseZoom, { 
        zoom: desiredZoom,
        onUpdate: () => {
          this.vizContainer.scale.set(this.camera.zoom);
        },
        ease: Power2.easeOut
      })
    },
    zoomOut() {

      let desiredZoom = this.camera.zoom - (this.camera.zoom/4);
      //@todo limit zoom out to world size
      desiredZoom = Math.max(desiredZoom, 0.01);
      TweenLite.to(this.camera, durations.mouseZoom, { 
        zoom: desiredZoom,
        onUpdate: () => {
          this.vizContainer.scale.set(this.camera.zoom);
        },
        ease: Power2.easeOut
      })

    },
    zoomToWorld() {

      const canvasRatio = this.canvas.width / this.canvas.height;
      const frameRatio = this.world.width / this.world.height;

      let desiredZoom;
      if(frameRatio > canvasRatio) {
        desiredZoom = this.canvas.width / this.world.width;
      } else {
        desiredZoom = this.canvas.height / this.world.height;
      }
      
      desiredZoom = Math.max(desiredZoom, 0.01);
      desiredZoom = Math.min(desiredZoom, 1);

      TweenLite.to(this.camera, durations.worldZoom, { 
        zoom: desiredZoom,
        onUpdate: () => {
          this.vizContainer.scale.set(this.camera.zoom);
        },
        ease: Power2.easeOut
      })
    },
    //@debug show viewport grid
    updateDebugGrid() {
      
      if(this.debugContainer) this.debugContainer.parent.removeChild(this.debugContainer);
      this.debugContainer = new PIXI.Container();
      this.vizContainer.addChild(this.debugContainer)

      //@debug red tinted background with world dimensions
      let bg = new PIXI.Sprite(PIXI.Texture.WHITE)
      bg.tint = 0xff0000
      bg.alpha = 0.2
      bg.x = 0
      bg.y = 0
      bg.width = this.world.width
      bg.height = this.world.height
      bg.anchor.set(0.5);
      this.debugContainer.addChild(bg)

      let sprite = this.debugContainer.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
      sprite.tint = 0x0000ff
      sprite.width = 12;
      sprite.height = this.world.height;
      sprite.anchor.set(0.5);
      sprite = this.debugContainer.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
      sprite.tint = 0x0000ff
      sprite.height = 12;
      sprite.width = this.world.width;
      sprite.anchor.set(0.5);
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

    this.vizContainer = new PIXI.Container();
    //this.vizContainer.scale.set(0.125);

    // init invert filter
    const colorMatrix = new PIXI.filters.ColorMatrixFilter()
    colorMatrix.negative()
    colorMatrix.alpha = 0
    this.PIXIApp.stage.filters = [colorMatrix]

    this.$store.commit('setPIXIApp', this.PIXIApp);
    this.$store.commit('setVizContainer', this.vizContainer);
    
    //already put the assumed canvas-size in the store, so that forceLayout can respect it
    this.$store.dispatch('updateCanvasSize', {
      width: document.body.clientWidth, 
      height: document.body.clientHeight
    });

    //EventBus.$on('zoomToBBox', this.zoomToFitBBox);
    EventBus.$on('zoomToWorld', this.zoomToWorld);
    EventBus.$on('zoomIn', this.zoomIn);
    EventBus.$on('zoomOut', this.zoomOut);
  },
  mounted: function() {

    //handle resize
    this.PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.PIXIApp.stage.addChild(this.vizContainer);
    this.$refs.rendererWrapper.appendChild(this.PIXIApp.view);
  }
}
</script>

<style scoped lang="scss">
.renderer__wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-canvas);
  transition: background-color 2s ease-in-out;
}
</style>