<template>
  <div class="overview">
    <router-link :to="`/viz/`">hello this is a cloud</router-link>
  
    <VizCloudItem v-for="item in items" 
      :item="item" 
      :cloudname="cloudname" 
      :subpath="subpath"
      :key="item.id" />

    <!-- @debug single item -->
    <!--VizCloudItem :item="items.find(child => child.id === 'Ziege')" :cloudname="cloudname" /-->
    <!--VizCloudItem :item="items[0]" :cloudname="cloudname" /-->
  
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizCloudItem from './VizCloudItem'

export default {
  name: 'viz-cloud',
  props: {
    cloudname: { type: String, required: true },
    subpath: { type: String, required: true },
    items: { type: Array, required: true }
  },
  components: { VizCloudItem },
  computed: mapState(['canvas', 'viewport']),
  data: () => {
    return {
      renderItems: [],
      cloudContainer: null
    }
  },
  watch: {
    canvas(newval) {   
      this.resize(newval);
    }
  },
  methods: {
    resize(canvas) {

      //center overview cloud
      if(this.cloudContainer) {
        this.cloudContainer.position.set(canvas.width/2, canvas.height/2)
      }

      const cloudBox = this.$store.getters.cloudBBox(this.cloudname)

      // information for which axis is relevant for snapZoom
      const remainders = {
        x: canvas.width - cloudBox.width,
        y: canvas.height - cloudBox.height
      }
      //console.table(remainders)

      // evaluate relevant axis for snapZoom
      // TODO: #1 double check if logic is correct
      // TODO: #2 make padding value less arbitrary
      const relevantDimension = {
        ...(remainders.x < remainders.y && { width: cloudBox.width + 100 }),
        ...(remainders.y < remainders.x && { height: cloudBox.height + 100 })
      }

      // zoom to fit and center
      this.viewport.snapZoom({
        ...relevantDimension,
        center: new PIXI.Point(canvas.width/2, canvas.height/2),
        removeOnComplete: true,
        removeOnInterrupt: true
      })
    },
    initForceLayout() {

      //only ever compute once
      if(this.$store.state.clouds[this.cloudname]) return;

      this.$store.dispatch('computeForceLayout', {
        key: this.cloudname,
        data: this.items
      });
    }
  },
  beforeMount: function() {
    console.log("hello this is a cloud")

    // create container for tag cloud
    //@todo implications of only created once?
    if(!this.cloudContainer) {
      this.cloudContainer = new PIXI.Container()
      this.cloudContainer.name = `cloud-${this.cloudname}`
      this.cloudContainer.sortableChildren = true // necessary for enabling zIndex sorting of children
    }

    //@todo preload all child images?

    //create cloud overview force layout
    this.initForceLayout();
  },
  mounted: function() {

    //@todo prevent double resize call
    this.resize(this.canvas);

    this.viewport.addChild(this.cloudContainer);
  },
  beforeDestroy: function () {
    this.viewport.removeChild(this.cloudContainer)
  }
}
</script>

<style scoped lang="scss">
</style>
