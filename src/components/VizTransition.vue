<template>
  <div>
    Viz Transition Watcher

    <VizCloudSample v-for="sample in renderStack" ref="cloudsamples"
      :id="sample.id"
      :size="sample.size"
      :key="`viz-transition-${sample.id}`" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, Power2, Sine } from 'gsap/TweenMax'
import VizCloudSample from './VizCloudSample.vue'
import VizTooltip from './VizTooltip.vue'
import { convertTagOccurencesToCloudItems, getBBoxScaleFactor, getCutoutUID } from '../utils.js'
import { durations } from '../variables.js'
import EventBus from '../eventbus.js';

export default {
  name: 'viz-transition',
  data: function() {
    return {
      samplesContainer: null,
      fauxDetail: null,
      renderStack: []
    }
  },
  components: { VizCloudSample },
  computed: {
  ...mapState(['canvas', 'viewport', 'world', 'vizContainer', 'vizTransition']),
  },
  watch: {
    vizTransition({from, to}) {
      console.log('Hi this is Viz Transition Watcher');

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
      if(this.renderStack.length) this.renderStack = [];
    }
  },
  methods: {

    transitionOverviewToTag() {
      
      const loader = new PIXI.Loader();
      const tagTitle = this.vizTransition.targetId;

      //collect all first geometries of selected tag as sample ids
      const tag = this.$store.getters.tag(tagTitle);
      const samples = tag.occurrences.map(occ => {
        return {
          id: getCutoutUID(occ.origin, tag.title, occ.geometry[0].x, occ.geometry[0].y)
        }
      });
      this.stageSamples(loader, samples);

      this.prepareForceLayout();
      const targetPositions = this.$store.state.clouds[tagTitle];
      
      const targetBBox = this.$store.getters.cloudBBox(tagTitle);
      this.$store.dispatch('computeWorldSize', targetBBox);

      loader.load(() => {
        window.setTimeout(() => {
          
          //Zoom viewport to fit the next view
          EventBus.$emit('zoomToWorld');
          
          //Spread out target VizCloudSamples
          EventBus.$emit('spreadCloudItemSamples', {
            targetId: tagTitle,
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
      const tagTitle = this.$route.params.id;
      const objectId = this.vizTransition.targetId;
      const targetPositions = this.getDetailPositions(objectId, tagTitle);

      //preloading: collect all geometries of tag in one object as sample ids
      const object = this.$store.getters.object(objectId);
      const samples = object.tags.find(el => el.title === tagTitle).geometry.map(geo => {
        return {
          id: getCutoutUID(objectId, tagTitle, geo.x, geo.y)
        }
      });

      this.stageSamples(loader, samples);
      this.stageDetail(loader);

      loader.load(() => {
        window.setTimeout(() => {

          //Zoom viewport to fit the next view
          const frameBBox = this.$store.getters.detailFrameBBox(objectId);
          this.$store.dispatch('computeWorldSize', frameBBox);
          EventBus.$emit('zoomToWorld');
          
          //Spread out target VizCloudSamples
          EventBus.$emit('spreadCloudItemSamples', {
            targetId: tagTitle,
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

      const loader = new PIXI.Loader();
      const objectId = this.$route.params.id;
      const tagTitle = this.vizTransition.targetId;

      this.prepareForceLayout();
      
      const spawnPositions = this.getDetailPositions(objectId, tagTitle);
      const targetPositions = this.$store.state.clouds[tagTitle];
      const targetPosition = targetPositions.find(el => el.id === objectId);

      //preloading: collect all geometries of one tag in one object as sample ids
      const object = this.$store.getters.object(objectId);
      const samples = object.tags.find(el => el.title === tagTitle).geometry.map(geo => {
        return {
          id: getCutoutUID(objectId, tagTitle, geo.x, geo.y)
        }
      });
      
      this.stageSamples(loader, samples);
      
      loader.load(() => {

        EventBus.$emit('fadeOutDetail');

        //mount VizCloudSamples for transition animation
        this.renderStack = samples.map(sample => {
          const origin = sample.id.split('-')[0];
          return {
            id: sample.id,
            size: targetPosition.size
          };
        });
        //render first item on top
        const firstItem = this.renderStack.shift();
        this.renderStack.push(firstItem);

        //wait for vue to reflect the new renderStack as VizCloudSamples
        this.$nextTick(() => {

          this.$refs.cloudsamples.forEach((cloudSample) => {

            const spawnPosition = spawnPositions.find(el => el.id === cloudSample.id);

            TweenLite
              .fromTo(cloudSample.sprite, durations.sampleSpread, {
                x: spawnPosition.x,
                y: spawnPosition.y,
                width: spawnPosition.size,
                height: spawnPosition.size
              }, {
                x: targetPosition.x,
                y: targetPosition.y,
                width: targetPosition.size,
                height: targetPosition.size,
                ease: Sine.easeInOut,
                onComplete: () => {
                  const targetBBox = this.$store.getters.cloudBBox(tagTitle);
                  this.$store.dispatch('computeWorldSize', targetBBox);
                  EventBus.$emit('zoomToWorld');
                }
              })

            //center
            /*TweenLite
              .fromTo(cloudSample.sprite, durations.sampleSpread, {
                x: spawnPosition.x,
                y: spawnPosition.y,
                width: spawnPosition.size,
                height: spawnPosition.size
              }, {
                x: -targetPosition.size/2,
                y: -targetPosition.size/2,
                width: targetPosition.size,
                height: targetPosition.size,
                ease: Sine.easeInOut
              })
            
            TweenLite
              .to(cloudSample.sprite, 1, {
                x: targetPosition.x,
                y: targetPosition.y,
                width: targetPosition.size,
                height: targetPosition.size,
                ease: Sine.easeInOut,
                delay: durations.sampleSpread
              })*/
          });
        });

        //Route to the target view
        window.setTimeout(() => {
          this.$router.push({ path: this.vizTransition.targetPath })
          //this.$store.dispatch('endVizTransition');  
          //EventBus.$emit('endVizTransition');
        }, (durations.sampleSpread + durations.worldZoom) * 1000);
      });
    },


    getDetailPositions(objectId, tagTitle) {

      const positions = [];      
      const object = this.$store.getters.object(objectId);
      const detailFrameBBox = this.$store.getters.detailFrameBBox(objectId);
      
      //collect all geometries of tag in one object as sample ids
      const samples = object.tags.find(el => el.title === tagTitle).geometry.map(geo => {

        positions.push({
          id: getCutoutUID(objectId, tagTitle, geo.x, geo.y),
          x: geo.x - detailFrameBBox.x - (detailFrameBBox.width/2),
          y: geo.y - detailFrameBBox.y - (detailFrameBBox.height/2),
          size: geo.size
        })
      });
      
      return positions;
    },

    prepareForceLayout() {

      const tagTitle = this.vizTransition.targetId;

      //only ever compute cloud layout once
      if(!this.$store.state.clouds[tagTitle]) {
        const tag = this.$store.getters.tag(tagTitle)
        const cloudItems = convertTagOccurencesToCloudItems(tag)
        this.$store.dispatch('computeForceLayout', {
          key: tagTitle,
          data: cloudItems
        });
      }
    },

    /**
     * add samples to loader for preloading
     */
    stageSamples(loader, samples) {
      samples.forEach((sample) => {
        if(!PIXI.utils.TextureCache[sample.id]) {
          const origin = sample.id.split('-')[0];
          loader.add(sample.id, `${process.env.VUE_APP_URL_SAMPLE}/${origin}/${sample.id}.jpg`);
        }
      })
    },

    /**
     * add detail image to loader for preloading
     */
    stageDetail(loader) {
      const detailId = this.vizTransition.targetId;
      if(!PIXI.utils.TextureCache[detailId]) {
        loader.add(detailId, `${process.env.VUE_APP_URL_DETAIL}/${detailId}/${detailId}-Frame.jpg`)
      }
    },

    /**
     * fauxDetail is only visible for the fade-in, then router will go to the actual detail url
     */
    createFauxDetail() {
    
      const detailId = this.vizTransition.targetId;
      const sprite = this.fauxDetail = new PIXI.Sprite()
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      sprite.texture = PIXI.utils.TextureCache[detailId]
      
      //apply scaling to stay within viewport dimensions
      const detailFrameBBox = this.$store.getters.detailFrameBBox(detailId);
      const detailScaleFactor = getBBoxScaleFactor(this.canvas, detailFrameBBox);
      
      //fade-in detail image
      this.vizContainer.addChild(sprite) 
      TweenLite.to(sprite, durations.detailFadeIn, {
        alpha: 1,
        delay: durations.sampleSpread,
        ease: Power2.easeIn
      });
    },

    destroyFauxDetail() {
      if(this.fauxDetail) this.vizContainer.removeChild(this.fauxDetail);
      this.fauxDetail = null;
    }

  },
  beforeMount() {
    this.samplesContainer = new PIXI.Container();
  },
  mounted() {
    this.vizContainer.addChild(this.samplesContainer);
  },
  beforeDestroy() {
    this.destroyFauxDetail();
    this.vizContainer.removeChild(this.samplesContainer)
  }
}
</script>

<style scoped lang="scss">
</style>