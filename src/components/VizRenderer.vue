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
  components: { VizOverview },
  computed: mapState(['canvas']),
  methods: {
      load() {
      },
      spreadTags() {
      },
      spreadCutouts() {
      },
      goToDetail() {
      }
  },
  mounted: function() {
    
    console.log("hello this is a renderer")

    /*const PIXIApp = this.PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: true,
      resolution: 1
    })

    // append PIXI.Application to wrapper
    const wrap = this.$refs.rendererWrapper;
    wrap.appendChild(PIXIApp.view)

    // create root containers for cloud and object view
    this.cloudContainer = new PIXI.Container()
    this.cloudContainer.name = 'cloudContainer'
    this.cloudContainer.x = this.canvas.width/2;
    this.cloudContainer.y = this.canvas.height/2;
    PIXIApp.stage.addChild(this.cloudContainer)
    
    //handle resize
    PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    //create cloud overview force layout
    if(!this.$store.state.clouds.overview) {
      
      const forceInput = this.taglist.map(tag => {
        return { 
          id: tag.title, 
          weight: tag.tagCount 
        };
      });

      this.$store.dispatch('computeForceLayout', {
        key: 'overview',
        data: forceInput
      });
    }

  },
  methods: {
    handleResize() {
      const { clientWidth: width, clientHeight: height } = this.$refs.rendererWrapper;
      this.PIXIApp.renderer.resize(width, height);
      this.$store.dispatch('updateCanvasSize', {width, height});

      //instantly set initial center
      if(this.cloudContainer.x === 0) {
        this.cloudContainer.x = width/2;
        this.cloudContainer.y = height/2;
        return;
      }

      new TimelineMax()
        .add( TweenMax.to(this.cloudContainer, 0.5, {x: width/2, y: height/2}) )
        .play()
    } */
  },
}
</script>

<style scoped lang="scss">
.vizhtml {
    /*position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    transform: scale(0.25);
    transform-origin: top right;
    height: 100%;
    overflow: auto;*/
    padding: 16px;
}
.renderer__wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-0);
  transition: background-color 2s ease-in-out;
}
</style>