<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${item.id}`">Cloud item {{item.id}}</router-link>

    <VizCloudSample v-for="sample in renderStack" ref="cloudsamples"
      :sample="sample"
      :key="`${sample.id}`" />
    <VizTooltip
      :content="tooltipContent"
      :yOffset="position.size"
    />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, Power2, Sine } from 'gsap/TweenMax'
import VizCloudSample from './VizCloudSample.vue'
import VizTooltip from './VizTooltip.vue'
import EventBus from '../eventbus.js';
import { getCutoutUID, convertTagOccurencesToCloudItems } from '../utils.js'
import { durations } from '../variables.js'

export default {
  name: 'viz-cloud-item',
  props: {
    item: { type: Object, required: true },
    cloudname: { type: String, required: true },
    subpath: { type: String, required: true },
  },
  data: function() {
    return {
      itemContainer: null,
      samplesContainer: null,
      renderIndex: 0, //index of next appended item
      renderStack: [], //array of items that are rendered
      isHovered: false
    }
  },
  watch: {

  },
  components: { VizCloudSample, VizTooltip },
  computed: {
    ...mapState(['canvas', 'viewport']),
    position: function () {
      return this.$store.getters.positionInCloud(this.cloudname, this.item.id)
    },
    tooltipContent: function () {
      if (this.cloudname != 'overview') {
        const tagData = this.$store.getters.tag(this.cloudname)
        const originTitle = this.$store.getters.object(this.item.id).title
        const originCount = tagData.occurrences.find(occurrence => occurrence.origin === this.item.id).geometry.length
        return originCount + ' ' + tagData.title + '\n' + 'in ' + originTitle
      } else {
        return this.item.weight + ' ' + this.item.id
      }
    }
  },
  methods: {
    appendNext() {

      //don't shuffle while hovered
      if(this.isHovered) return;

      //if there is only one sample that is already in the renderStack, do nothing
      if(this.item.samples.length === 1 && this.renderStack.length === 1) return;

      //@todo bugfix - when there are only two samples, VizCloudSamples seem not to be remounted, resulting in no re-appending on PIXI level
      //console.log('hmm ...', this.item.samples.length, this.renderIndex)

      //next sample to be appended
      const nextSample = this.item.samples[this.renderIndex];

      //clone renderStack and add nextSample
      let renderStack = this.renderStack.map(d => d);
      renderStack.push(nextSample)    
      
      //only keep last two samples
      if(renderStack.length > 2) {
        renderStack = renderStack.slice(renderStack.length-2);
      }

      //update render stack
      this.renderStack = renderStack;
      this.renderIndex++;
      if(this.renderIndex === this.item.samples.length) this.renderIndex = 0;
    },
    fillRenderStack(callback) {
      //remember the currently visible cutout (last item in renderStack)
      const topMostSample = this.renderStack.pop();
      
      //empty the renderStack for one tick ... this is a hack to force Vue to re-mount 
      //all VizCutoutSamples in the desired order, so that topMostSample stays on top
      //otherwise the change will not be visible on PIXI level
      this.renderStack = [];
      
      //wait for vue to reflect the new renderStack as VizCloudSamples
      this.$nextTick(() => {

        //put all samples in the renderStack, put topMostSample at the top again
        let renderStack = this.item.samples.map(d => d);
        renderStack.splice(renderStack.indexOf(topMostSample), 1);
        renderStack.push(topMostSample);
        this.renderStack = renderStack;
        
        //wait for vue to reflect the new renderStack as VizCloudSamples
        this.$nextTick(() => {
          if(callback) callback();
        });
      });
    },
    handlePointerTap() {

      if(this.$store.state.isDragging) return;
      console.log('itemContainer tap!', this.item);

      const from = this.$route.name;
      const to = (from === 'viz-overview') ? 'viz-tag' : (from === 'viz-tag') ? 'viz-detail' : '';

      //deactivate interaction, animation only from this point
      this.samplesContainer.interactive = false;
      this.samplesContainer.buttonMode = false;

      //center the selected CloudItem
      //@todo it would probably be better to move the camera to the item, but I don't get pixi-viewport configured correctly
      TweenLite.to(this.itemContainer, 1, {
        x: -this.position.size/2,
        y: -this.position.size/2,
        ease: Power2.easeOut
      });

      //start the transition
      this.$store.dispatch('beginVizTransition', { 
        from, to, 
        targetPath: `${this.subpath}/${this.item.id}`,
        trigger: this.item 
      });

      //after some preparations, beginVizTransition will trigger spreadCloudItemSamples
      EventBus.$once('spreadCloudItemSamples', ({targetId, targetPositions}) => {
        this.fillRenderStack(() => {
          this.spreadSamples(targetPositions);
        });
      });
    },
    spreadSamples(targetPositions) {
  
      //Remove offset of previous centering
      TweenLite.to(this.itemContainer, durations.sampleSpread, {
        x: 0,
        y: 0,
        ease: Sine.easeInOut
      });

      //Spread out all VizCloudSamples
      this.$refs.cloudsamples.forEach((cloudSample) => {

        //@todo unify
        let newPosition;
        if(this.$route.name === 'viz-overview') {
          newPosition = targetPositions.find(el => el.id === cloudSample.sample.origin);
        } else if(this.$route.name === 'viz-tag') {
          newPosition = targetPositions.find(el => el.id === cloudSample.sample.id);
        }

        TweenLite.to(cloudSample.sprite, durations.sampleSpread, {
          x: newPosition.x,
          y: newPosition.y,
          width: newPosition.size,
          height: newPosition.size,
          ease: Sine.easeInOut
        })
      });
    }
  },
  beforeMount: function() {
    console.log("hello this is a cloud item")
  
    // itemContainer stores samplesContainer and textBox
    const itemContainer = this.itemContainer = new PIXI.Container();
    itemContainer.x = this.position.x
    itemContainer.y = this.position.y

    // samplesContainer will store all sprites from VizCloudSample.vue
    const samplesContainer = this.samplesContainer = new PIXI.Container();
    samplesContainer.width = this.position.size
    samplesContainer.height = this.position.size
    itemContainer.addChild(samplesContainer)

    // samplesContainer is interactive to avoid events
    // on itemContainer (that also stores textBox)
    samplesContainer.interactive = true;
    samplesContainer.buttonMode = true;
    samplesContainer.on('pointertap', this.handlePointerTap);
    samplesContainer.on('pointerover', () => {    
      itemContainer.zIndex = 1 // rendered above all other itemContainer's to ensure textBox visibility
      this.isHovered = true
    })
    samplesContainer.on('pointerout', () => {
      itemContainer.zIndex = 0 // back to default zIndex layer
      this.isHovered = false
    })

    //@debug adds a sprite and random tint that will be removed on load
    /*let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size
    // add sprite
    itemContainer.addChild(sprite)*/
  },
  mounted: function() {
    this.$parent.cloudContainer.addChild(this.itemContainer);
  },
  beforeDestroy: function () {
    this.$parent.cloudContainer.removeChild(this.itemContainer)
  }
}
</script>

<style scoped lang="scss">
</style>