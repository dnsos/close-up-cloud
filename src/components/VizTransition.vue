<template>
  <div>
  Hello this is Viz Transition Watcher
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, Power2, Sine } from 'gsap/TweenMax'
import VizCloudSample from './VizCloudSample.vue'
import VizTooltip from './VizTooltip.vue'
import { getCutoutUID, convertTagOccurencesToCloudItems, getBBoxScaleFactor } from '../utils.js'
import { durations } from '../variables.js'
import EventBus from '../eventbus.js';

export default {
  name: 'viz-transition',
  data: function() {
    return {
      fauxDetail: null
    }
  },
  computed: {
  ...mapState(['canvas', 'viewport', 'vizTransition']),
  },
  watch: {
    vizTransition({from, to, trigger, targetPath}) {
      console.log('Hi this is Viz Transition Watcher triggered by', trigger);

      //@todo pause viewport interactions while transitioning

      if(from === 'viz-overview' && to === 'viz-tag') {
        this.transitionOverviewToTag();
      } else if(from === 'viz-tag' && to === 'viz-detail') {
        this.transitionTagToDetail();
      } if(from === 'viz-detail' && to === 'viz-tag') {
        this.transitionDetailToTag();
      }
    },
    $route() {
      if(this.fauxDetail) this.destroyFauxDetail();
    }
  },
  methods: {

    transitionOverviewToTag() {

      const loader = new PIXI.Loader();

      this.stageSamples(loader);
      this.prepareForceLayout();
      
      const tagId = this.vizTransition.trigger.id;
      const targetPositions = this.$store.state.clouds[tagId];
      const targetBBox = this.$store.getters.cloudBBox(tagId);

      loader.load(() => {
        //@todo better timeout solution
        window.setTimeout(() => {
          //Zoom viewport to fit the next view
          EventBus.$emit('zoomToBBox', targetBBox);
          //Spread out target VizCloudSamples
          EventBus.$emit('spreadCloudItemSamples', {
            targetId: tagId,
            targetPositions
          });
          //Route to the target view
          window.setTimeout(() => {
            this.$router.push({ path: this.vizTransition.targetPath })
            //this.$store.dispatch('endVizTransition');  
            //EventBus.$emit('endVizTransition');
          }, durations.sampleSpread * 1000);
        }, durations.sampleSpreadDelay * 1000)
      });
    },

    transitionTagToDetail() {

      const loader = new PIXI.Loader();
      const tagId = this.vizTransition.trigger.id;
      const targetPositions = this.getDetailPositions();

      this.stageSamples(loader);
      this.stageDetail(loader);

      loader.load(() => {
        //@todo better timeout solution
        window.setTimeout(() => {
          //Zoom viewport to fit the next view
          EventBus.$emit('zoomToBBox', this.canvas);
          //Spread out target VizCloudSamples
          EventBus.$emit('spreadCloudItemSamples', {
            targetId: tagId,
            targetPositions
          });

          //Fade-In Faux Detail
          this.createFauxDetail();

          //Route to the target view
          window.setTimeout(() => {
            this.$router.push({ path: this.vizTransition.targetPath })
            //this.$store.dispatch('endVizTransition');  
            //EventBus.$emit('endVizTransition');
          }, (durations.sampleSpread +  durations.detailFadeIn) * 1000);
        }, durations.sampleSpreadDelay * 1000)
      });
    },


    transitionDetailToTag() {

      this.prepareForceLayout();
      const tagId = this.vizTransition.trigger.id;
      const targetPositions = this.$store.state.clouds[tagId];
      const targetBBox = this.$store.getters.cloudBBox(tagId);

      //@todo better timeout solution
      window.setTimeout(() => {
        //Zoom viewport to fit the next view
        EventBus.$emit('zoomToBBox', targetBBox);
        //Spread out target VizCloudSamples
        EventBus.$emit('collectCloudItemSamples', {
          targetId: tagId,
          targetPositions
        });
        //Route to the target view
        window.setTimeout(() => {
          this.$router.push({ path: this.vizTransition.targetPath })
          //this.$store.dispatch('endVizTransition');  
          //EventBus.$emit('endVizTransition');
        }, durations.sampleSpread * 1000);
      }, durations.sampleSpreadDelay * 1000)
    },


    getDetailPositions() {

      const detailId = this.vizTransition.trigger.id;
      const detailFrameBBox = this.$store.getters.detailFrameBBox(detailId);
      const detailScaleFactor = getBBoxScaleFactor(this.canvas, detailFrameBBox);

      const positions = [];
      this.vizTransition.trigger.samples.forEach(sample => {

        let {x, y, size} = sample;
        
        //subtract frame offset
        x -= detailFrameBBox.x;
        y -= detailFrameBBox.y;

        //subtract half size
        x -= detailFrameBBox.width/2;
        y -= detailFrameBBox.height/2;

        //apply scaling
        x *= detailScaleFactor;
        y *= detailScaleFactor;
        size *= detailScaleFactor;

        positions.push({
          id: sample.id,
          x, y, size
        });
      });
      
      return positions;
    },

    prepareForceLayout() {

      const tagId = this.vizTransition.trigger.id;

      //only ever compute cloud layout once
      if(!this.$store.state.clouds[tagId]) {
        const tag = this.$store.getters.tag(tagId)
        const cloudItems = convertTagOccurencesToCloudItems(tag)
        this.$store.dispatch('computeForceLayout', {
          key: tagId,
          data: cloudItems
        });
      }
    },

    /**
     * add samples to loader for preloading
     */
    stageSamples(loader) {
      this.vizTransition.trigger.samples.forEach((sample) => {
        const fileName = sample.origin;
        const sampleUrl = `${process.env.VUE_APP_URL_SAMPLE}/${fileName}/${sample.id}.jpg`;
        if(!PIXI.utils.TextureCache[sampleUrl]) {
          loader.add(sampleUrl);
        }
      })
    },

    /**
     * add detail image to loader for preloading
     */
    stageDetail(loader) {
      const detailId = this.vizTransition.trigger.id;
      if(!PIXI.utils.TextureCache[detailId]) {
        loader.add(detailId, `${process.env.VUE_APP_URL_DETAIL}/${detailId}/${detailId}-Frame.jpg`)
      }
    },

    /**
     * fauxDetail is only visible for the fade-in, then router will go to the actual detail url
     */
    createFauxDetail() {
    
      const detailId = this.vizTransition.trigger.id;
      const sprite = this.fauxDetail = new PIXI.Sprite()
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      sprite.position.set(this.canvas.width/2, this.canvas.height/2)
      sprite.texture = PIXI.utils.TextureCache[detailId]
      
      //apply scaling to stay within viewport dimensions
      const detailFrameBBox = this.$store.getters.detailFrameBBox(detailId);
      const detailScaleFactor = getBBoxScaleFactor(this.canvas, detailFrameBBox);
      sprite.width = detailFrameBBox.width * detailScaleFactor;
      sprite.height = detailFrameBBox.height * detailScaleFactor;
      
      //fade-in detail image
      this.viewport.addChild(sprite) 
      TweenLite.to(sprite, durations.detailFadeIn, {
        alpha: 1,
        delay: durations.sampleSpread,
        ease: Power2.easeIn
      });
    },

    destroyFauxDetail() {
      if(this.fauxDetail) this.viewport.removeChild(this.fauxDetail);
      this.fauxDetail = null;
    }

  },
  beforeMount() {
  },
  mounted() {
  },
  beforeDestroy() {
    this.destroyFauxDetail();
  }
}
</script>

<style scoped lang="scss">
</style>