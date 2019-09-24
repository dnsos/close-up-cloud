<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <div class="vizhtml">
      <router-link :to="`/viz`">
        hello this is a single renderer
      </router-link>
      <router-view /> <!-- here goes VitOverview, VizTag, VizDetail via router -->
    </div>
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { TweenLite, Power1, Power2 } from 'gsap/TweenMax'
import { mapState } from 'vuex'
import { durations, minZoomFactor, maxZoomFactor } from '../variables.js'

export default {
  name: 'viz-renderer',
  computed: mapState(['canvas', 'taglist', 'inverted']),
  data: () => {
    return {
      PIXIApp: null,
      viewport: null,
      viewportCenter: {x: 0, y: 0}, //helper point for center animation
      debugContainer: null
    };
  },
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

      //@todo bugfix: sometimes while resizing browser says "Cannot read property 'clientWidth' of undefined" – wtf?
      if(!this.$refs.rendererWrapper) return;
      const { clientWidth: width, clientHeight: height } = this.$refs.rendererWrapper;
      this.PIXIApp.renderer.resize(width, height);
      this.viewport.resize(width, height, width, height);
      this.$store.dispatch('updateCanvasSize', {width, height});

      //update viewport zoom range
      const minZoomFactor = 0.75;
      const maxZoomFactor = 10;
      this.viewport
        .clamp({
          direction: 'all'
        })
        .clampZoom({
          minWidth: width/maxZoomFactor,
          minHeight: height/maxZoomFactor,
          maxWidth: width/minZoomFactor,
          maxHeight: height/minZoomFactor
        })

      //center view
      this.moveToPoint();

      //@debug show viewport grid
      //this.appendDebugGrid();
    },
    moveToPoint(point) {
      //default screen center
      if(!point) point = {x: this.canvas.width/2, y: this.canvas.height/2};

      console.log(point);

      TweenLite.to(this.viewportCenter, 1, { 
        x: point.x, 
        y: point.y,
        onUpdate: () => {
          this.viewport.moveCenter(this.viewportCenter.x, this.viewportCenter.y);
        },
        ease: Power2.easeOut
      })
    },
    zoomToFitBBox(boundingBox) {

      const padding = 64;
      const canvasRatio = this.canvas.width / this.canvas.height;
      const frameRatio = boundingBox.width / boundingBox.height;

      let relevantDimension;
      if(frameRatio > canvasRatio) {
        relevantDimension = { width: boundingBox.width + (padding*2) };
      } else {
        relevantDimension = { height: boundingBox.height + (padding*2) };
      }

      this.viewport.snapZoom({
        ...relevantDimension,
        center: new PIXI.Point(this.canvas.width/2, this.canvas.height/2),
        removeOnComplete: true,
        removeOnInterrupt: true,
        time: durations.sampleSpread * 1000,
        ease:  function(t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b; // = easeOutQuad = Power2.easeOut 
        },
      })
    },
    getDetailScaleFactor(frameBBox) {
      
      const padding = 0;
      const canvasRatio = this.canvas.width / this.canvas.height;
      const frameRatio = frameBBox.width / frameBBox.height;

      let scaleFactor;
      if(frameRatio > canvasRatio) {
        scaleFactor = (this.canvas.width - (padding*2)) / (frameBBox.width);
      } else {
        scaleFactor = (this.canvas.height - (padding*2)) / (frameBBox.height);
      }

      return scaleFactor;
    },
    //@debug show viewport grid
    appendDebugGrid() {
      
      if(this.debugContainer) this.debugContainer.parent.removeChild(this.debugContainer);
      this.debugContainer = new PIXI.Container();
      this.viewport.addChild(this.debugContainer)

      //@debug red tinted background with viewport.worldWidth dimensions
      let bg = new PIXI.Sprite(PIXI.Texture.WHITE)
      bg.tint = 0xff0000
      bg.alpha = 0.2
      bg.x = 0
      bg.y = 0
      bg.width = this.viewport.worldWidth
      bg.height = this.viewport.worldHeight
      this.debugContainer.addChild(bg)

      //@debug blue tinted background with viewport.screenWidth dimensions
      /*bg = new PIXI.Sprite(PIXI.Texture.WHITE)
      bg.tint = 0x000ff000
      bg.alpha = 0.2
      bg.x = 0
      bg.y = 0
      bg.width = this.viewport.screenWidth
      bg.height = this.viewport.screenHeight
      this.debugContainer.addChild(bg)*/
      
      
      //@debug viewport grid
      for(let x=1; x<12; x++) {
        let sprite = this.debugContainer.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0xff0000
        if(x===6) sprite.tint = 0x0000ff
        sprite.width = 2;
        sprite.height = this.viewport.worldHeight;
        sprite.position.set((this.viewport.worldWidth/12)*x, 0)
      }
      for(let y=1; y<12; y++) {
        let sprite = this.debugContainer.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0xff0000
        if(y===6) sprite.tint = 0x0000ff
        sprite.width = this.viewport.worldWidth;
        sprite.height = 2;
        sprite.position.set(0, (this.viewport.worldHeight/12)*y)
      }
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

      // width/height values will be overwritten by handleResize
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
      this.viewportCenter.x = this.viewport.center.x;
      this.viewportCenter.y = this.viewport.center.y;
    })
    /*.on('moved', () => {
      console.log(this.viewport.center.x, this.viewport.center.y)
    })*/
    .on('zoomed', (e) => {
      //console.log('Current scale:', e.viewport.transform.scale.x)
      this.viewportCenter.x = this.viewport.center.x;
      this.viewportCenter.y = this.viewport.center.y;
    })

    // init invert filter
    const colorMatrix = new PIXI.filters.ColorMatrixFilter()
    colorMatrix.negative()
    colorMatrix.alpha = 0
    this.PIXIApp.stage.filters = [colorMatrix]

    this.$store.commit('setPIXIApp', this.PIXIApp);
    this.$store.commit('setViewport', this.viewport);
    this.$store.commit('setRenderer', this);
    
    //already put the assumed canvas-size in the store, so that forceLayout can respect it
    this.$store.dispatch('updateCanvasSize', {
      width: this.$parent.$refs.main.clientWidth, 
      height: this.$parent.$refs.main.clientHeight
    });
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
    
    //handle resize
    this.PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
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