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
  computed: mapState(['canvas', 'viewport', 'renderer']),
  data: () => {
    return {
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
      
      //zoom to fit and center
      const cloudBox = this.$store.getters.cloudBBox(this.cloudname);
      this.renderer.zoomToFitBBox(cloudBox);
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
      
      const loader = new PIXI.Loader();
      
      //pre-load samples
      this.items.forEach((item, i) => {
        const sampleUrl = this.sampleGenerators[i].next().value;
        if(sampleUrl && !PIXI.utils.TextureCache[sampleUrl]) {
          loader.add(sampleUrl);
        }
      });
      
      loader.load(() => {
        for(let clouditem of this.$refs.clouditems) {
          clouditem.appendNext();
        }
      })

      this.loadChunkTimeout = window.setTimeout(this.loadSampleChunks, durations.sampleVisible * 1000);
    },
    hideOtherItems(id) {

      window.clearTimeout(this.loadChunkTimeout);

      for(let clouditem of this.$refs.clouditems) {
        if(clouditem.item.id !== id) {
          TweenLite.to(clouditem.itemContainer, 0.5, { alpha: 0 }, Power2.easeOut);
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

    //if we came here with a spread transition that skips fade-in, enable fade-in again
    if(this.$store.state.skipFadeIn) {
      this.$nextTick(() => {
        this.$store.commit('skipFadeIn', false);
      });
    }
    
    //pause and resume loading sample chunks on window blur/focus
    window.addEventListener('blur', () => {
      window.clearTimeout(this.loadChunkTimeout);
    })
    window.addEventListener('focus', () => {
      this.loadChunkTimeout = window.setTimeout(this.loadSampleChunks, durations.sampleVisible * 1000);
    })

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
