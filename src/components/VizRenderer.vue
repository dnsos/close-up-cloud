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
import { TweenLite, Power1, Power2 } from 'gsap/TweenMax'
import { mapState } from 'vuex'
import VizTransition from './VizTransition.vue'
import VizInput from './VizInput.vue'
import { durations } from '../variables.js'
import { getBBoxScaleFactor } from '../utils.js'
import EventBus from '../eventbus.js';

export default {
  name: 'viz-renderer',
  computed: mapState(['canvas', 'world', 'camera', 'cameraZoom', 'inverted', 'vizTransition']),
  components: { VizTransition, VizInput },
  data: () => {
    return {
      PIXIApp: null,
      vizContainer: null,
      centerContainer: null,
      debugContainer: null
    };
  },
  watch: {
    inverted: function (newValue) {
      const targetAlpha = (newValue === true) ? 1 : 0;
      TweenLite.to(this.PIXIApp.stage.filters[0], durations.invert, { alpha: targetAlpha, ease: Power1.easeInOut } )
    },
    camera: function(newValue) {
      this.vizContainer.position.set(newValue.x, newValue.y);
    },
    cameraZoom: function(newValue, previousValue) {
      const { zoom, center } = newValue;
      this.vizContainer.scale.set(zoom);

      /**
       * preserve cursor position in world 
       * @see http://embed.plnkr.co/II6lgj511fsQ7l0QCoRi/
       */
      const x = center.x - (this.canvas.width/2);
      const y = center.y - (this.canvas.height/2);
      var worldPos = {
        x: (x - this.camera.x) / previousValue.zoom, 
        y: (y - this.camera.y) / previousValue.zoom
      };
      var newScreenPos = {
        x: (worldPos.x * zoom) + this.camera.x, 
        y: (worldPos.y * zoom) + this.camera.y
      };
      this.$store.commit('setCamera', { 
        x: this.camera.x - (newScreenPos.x-x),
        y: this.camera.y - (newScreenPos.y-y)
      });
    },
    //@debug update viewport grid
    //world: function() { this.updateDebugGrid(); }
  },
  methods: {
    handleResize() {

      //@todo bugfix: sometimes while resizing browser says "Cannot read property 'clientWidth' of undefined" – wtf?
      if(!this.$refs.rendererWrapper) return;
      
      const { clientWidth, clientHeight } = this.$refs.rendererWrapper;

      this.PIXIApp.renderer.resize(clientWidth, clientHeight);
      this.centerContainer.position.set(clientWidth/2, clientHeight/2);
      this.$store.dispatch('updateCanvasSize', {
        width: clientWidth, 
        height: clientHeight});

      //@todo probably world should update too on resize, bc right now world has initially the same aspect ratio as canvas
    },
    centerWorld(duration) {
      let tmp = { ... this.camera };
      TweenLite.to(tmp, duration, { 
        x: 0, y: 0,
        onUpdate: () => {
          this.vizContainer.position.set(tmp.x, tmp.y);
        },
        onComplete: () => {
          //if I commit onUpdate here it breaks irregular  ...
          this.$store.commit('setCamera', {x: 0, y: 0})
        },
        ease: Power2.easeInOut
      })
    },
    zoomToWorld() {

      const minZoom = getBBoxScaleFactor(this.canvas, this.world);
      let desiredZoom = minZoom;
      desiredZoom = Math.min(desiredZoom, 1);
      
      this.$store.commit('setCameraMinZoom', minZoom);

      //tween a temporary object with camera vars, commit on complete
      let tmp = { 
        x: this.camera.x,
        y: this.camera.y,
        zoom: this.cameraZoom.zoom
      };
      TweenLite.to(tmp, durations.worldZoom, { 
        x: 0, //center camera
        y: 0,
        zoom: desiredZoom,
        onUpdate: () => {
          this.$store.commit('setCamera', {x: tmp.x, y: tmp.y});
          this.$store.commit('setCameraZoom', {
            zoom: tmp.zoom,
            center: {
              x: this.canvas.width/2, 
              y: this.canvas.height/2 
            }
          })
        },
        ease: Power2.easeInOut
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
    //console.log("hello this is a renderer")

    this.PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: true,
      resolution: 1
    })

    this.centerContainer = new PIXI.Container(); //always stays centered
    this.vizContainer = new PIXI.Container(); //viz root, zoom and pan
    this.centerContainer.addChild(this.vizContainer);

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

    EventBus.$on('zoomToWorld', this.zoomToWorld);
    EventBus.$on('centerWorld', this.centerWorld);
  },
  mounted: function() {

    //handle resize
    this.PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.PIXIApp.stage.addChild(this.centerContainer);
    this.$refs.rendererWrapper.appendChild(this.PIXIApp.view);
  },
  beforeDestroy: function () {
    this.PIXIApp.stage.removeChild(this.centerContainer);
    this.$refs.rendererWrapper.removeChild(this.PIXIApp.view);
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