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
import EventBus from '../eventbus.js';

export default {
  name: 'viz-cloud',
  props: {
    cloudname: { type: String, required: true },
    subpath: { type: String, required: true },
    items: { type: Array, required: true }
  },
  components: { VizCloudItem },
  computed: mapState(['canvas', 'vizContainer', 'vizTransition']),
  data: () => {
    return {
      cloudContainer: null,
      sampleGenerators: [],
      loadChunkTimeout: null
    }
  },
  watch: {
    vizTransition(newval) {
      this.hideOtherItems(newval.targetId);
    }
  },
  methods: {
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
        this.sampleGenerators.push(sampleGenerator(item));
      });

      //harvesting samples per item step by step for preloading and appending
      function * sampleGenerator(item) {
        for(let sample of item.samples) {
          const origin = sample.id.split('-')[0];
          yield {
            id: sample.id,
            url: `${process.env.VUE_APP_URL_SAMPLE}/${origin}/${sample.id}.jpg`
          };
        }
      }
    },
    loadSampleChunks() {
      
      const loader = new PIXI.Loader();
      
      //pre-load samples
      this.items.forEach((item, i) => {
        const sample = this.sampleGenerators[i].next().value;
        if(sample && !PIXI.utils.TextureCache[sample.id]) {
          loader.add(sample.id, sample.url);
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
    //console.log("hello this is a cloud")

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

    //if we came here with transition, enable fade-in again (vizCloudSamples)
    //@todo vizTransition should commit this
    if(this.$store.state.isTransitioning) {
      this.$nextTick(() => {
        this.$store.dispatch('endVizTransition');
      });
    //if this is a fresh page load, zoom to fit (vizTransition takes care of that otherwise)
    } else {
      const cloudBBox = this.$store.getters.cloudBBox(this.cloudname);
      this.$store.dispatch('computeWorldSize', cloudBBox);
      EventBus.$emit('zoomToWorld');
      EventBus.$emit('moveToCenter');
    }
    
    //pause and resume loading sample chunks on window blur/focus
    window.addEventListener('blur', () => {
      window.clearTimeout(this.loadChunkTimeout);
    })
    window.addEventListener('focus', () => {
      this.loadChunkTimeout = window.setTimeout(this.loadSampleChunks, durations.sampleVisible * 1000);
    })

    this.vizContainer.addChild(this.cloudContainer);
  },
  beforeDestroy: function() {
    this.vizContainer.removeChild(this.cloudContainer)
    window.clearTimeout(this.loadChunkTimeout);
  },
  destroyed: function() {
    this.cloudContainer.destroy(true);
  }
}
</script>

<style scoped lang="scss">
</style>
