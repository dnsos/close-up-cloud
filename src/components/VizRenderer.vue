<template>
  <div class="renderer__wrapper" ref="rendererWrapper">

    <div class="vizhtml">
      hello this is a single renderer
      <VizOverview />
    </div>

  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizOverview from '@/components/VizOverview.vue'

export default {
  name: 'viz-renderer',
  props: ['bus'],
  components: { VizOverview },
  computed: mapState(['canvas', 'taglist']),
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

    this.$store.commit('setPIXIApp', this.PIXIApp);
  },
  mounted: function() {

    const PIXIApp = this.PIXIApp

    // append PIXI.Application to wrapper
    const wrap = this.$refs.rendererWrapper;
    wrap.appendChild(PIXIApp.view)
    
    //handle resize
    PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

  },
  methods: {
    handleResize() {
      const { clientWidth: width, clientHeight: height } = this.$refs.rendererWrapper;
      this.PIXIApp.renderer.resize(width, height);
      this.$store.dispatch('updateCanvasSize', {width, height});
    }
  },
}
</script>

<style scoped lang="scss">
.vizhtml {
    position: absolute;
    right: 0;
    width: 20%;
    //transform: scale(0.25);
    transform-origin: top right;
    overflow: auto;
    padding: 8px;
}
.renderer__wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-0);
  transition: background-color 2s ease-in-out;
}
</style>