<template>
  <div class="overview">
    <router-link :to="`/viz/`">hello this is a cloud</router-link>
  
    <VizCloudItem v-for="item in items" ref="clouditems"
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
import { TweenLite, Power2 } from 'gsap/TweenMax'
import { mapState } from 'vuex'
import VizCloudItem from './VizCloudItem'
import { durations } from '../variables'

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
      isShuffling: true,
      cloudContainer: null,
      sampleGenerators: [],
      loadChunkTimeout: null
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
      /*this.viewport.snapZoom({
        ...relevantDimension,
        center: new PIXI.Point(canvas.width/2, canvas.height/2),
        removeOnComplete: true,
        removeOnInterrupt: true
      })*/
    },
    initForceLayout() {

      //only ever compute once
      if(this.$store.state.clouds[this.cloudname]) return;

      this.$store.dispatch('computeForceLayout', {
        key: this.cloudname,
        data: this.items
      });
    },
    createSampleGenerators() {

      this.items.forEach((item) => {
        const gen = sampleGenerator(item);
        this.sampleGenerators.push(gen);
      });

      //harvesting the sampleUrls per item in order
      function * sampleGenerator(item) {
        for(let sample of item.samples) {
          const fileName = sample.origin;
          const thumbName = `${sample.id}.jpg`;
          const cutoutPath = `${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName}`;
          yield cutoutPath;
        }
      }
    },
    loadSampleChunks() {
      
      const loader = PIXI.Loader.shared;
      
      //pre-load samples
      this.items.forEach((item, i) => {
        const sampleUrl = this.sampleGenerators[i].next().value;
        if(sampleUrl && !loader.resources[sampleUrl]) {
          loader.add(sampleUrl)
        }
      });
      
      loader.load(() => {
        for(let clouditem of this.$refs.clouditems) {
          clouditem.appendNext();
        }
      })

      //if(this.isShuffling) {
        this.loadChunkTimeout = window.setTimeout(this.loadSampleChunks, durations.sampleVisible * 1000);
      //}
    },
    hideOtherItems(id) {

      //this.isShuffling = false;
      window.clearTimeout(this.loadChunkTimeout);

      for(let clouditem of this.$refs.clouditems) {
        if(clouditem.item.id !== id) {
          TweenLite.to(clouditem.itemContainer, 0.5, { alpha: 0 });
        }
      }
    }
  },
  beforeMount: function() {
    console.log("hello this is a cloud")

    // create container for tag cloud
    this.cloudContainer = new PIXI.Container()
    this.cloudContainer.name = `cloud-${this.cloudname}`
    this.cloudContainer.sortableChildren = true // necessary for enabling zIndex sorting of children

    //create cloud overview force layout
    this.initForceLayout();
  },
  mounted: function() {

    this.createSampleGenerators();
    this.loadSampleChunks();


    //pause and resume loading sample chunks on window blur/focus
    window.addEventListener('blur', () => {
      window.clearTimeout(this.loadChunkTimeout);
    })
    window.addEventListener('focus', () => {
      this.loadChunkTimeout = window.setTimeout(this.loadSampleChunks, durations.sampleVisible * 1000);
    })

    //@todo prevent double resize call
    this.resize(this.canvas);

    this.viewport.addChild(this.cloudContainer);
  },
  beforeDestroy: function () {
    this.viewport.removeChild(this.cloudContainer)
    window.clearTimeout(this.loadChunkTimeout);
  }
}
</script>

<style scoped lang="scss">
</style>
