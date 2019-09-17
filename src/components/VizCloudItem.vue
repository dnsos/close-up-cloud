<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${item.id}`">Cloud item {{item.id}}</router-link>

    <VizCloudSample v-for="sample in renderStack" ref="cloudsamples"
      :sample="sample" 
      :item="item" 
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
import { TweenLite, Power2 } from 'gsap/TweenMax'
import VizCloudSample from './VizCloudSample.vue'
import VizTooltip from './VizTooltip.vue'
import { getCutoutUID } from '../utils.js'

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
      isHovered: false,
      isSpread: false
    }
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
    appendNext: function() {

      //don't shuffle while hovered
      if(this.isHovered) return;

      //don't shuffle while spread – all samples are visible now
      if(this.isSpread) return;

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
    }
  },
  beforeMount: function() {
  //console.log("hello this is a cloud item")
 
  // itemContainer stores samplesContainer and textBox
  const itemContainer = this.itemContainer = new PIXI.Container();
  
  itemContainer.x = this.position.x
  itemContainer.y = this.position.y

  // samplesContainer will store all sprites from VizCloudSample.vue
  const samplesContainer = this.samplesContainer = new PIXI.Container();
  samplesContainer.name = 'samplesContainer'
  samplesContainer.width = this.position.size
  samplesContainer.height = this.position.size

  // samplesContainer is interactive to avoid events
  // on itemContainer (that also stores textBox)
  samplesContainer.interactive = true;
  samplesContainer.buttonMode = true;

  samplesContainer.on('pointertap', () => {
    if(this.$store.state.isDragging) return;
    console.log('itemContainer tap!', this.item);



















// ########## big mess for spread animation START ##########

  
    
    //if(this.cloudname === 'overview') {

      const tag = this.$store.getters.tag(this.item.id)
      

    
    
    //set position of this item to canvas center
    TweenLite.to(this.itemContainer, 1, {
      x: -this.position.size/2,
      y: -this.position.size/2,
      ease: Power2.easeOut
    });
    

    //hide all other items
    this.$parent.hideOtherItems(tag.title);

    


      //only ever compute cloud layout once
      if(!this.$store.state.clouds[tag.title]) {

        const cloudItems = tag.occurrences.map(occ => {

          //per occurencant object: sample all geometries
          const samples = occ.geometry.map(geo => {
            const sample = {
              origin: occ.origin,
              x: geo.x,
              y: geo.y
            }
            sample.id = getCutoutUID(tag.title, sample);
            return sample;
          });

          return {
            id: occ.origin,
            weight: samples.length,
            samples: samples
          }
        });

        this.$store.dispatch('computeForceLayout', {
          key: tag.title,
          data: cloudItems
        });
      }
    //}




      //get size of next cloud and zoom in
      const cloudBox = this.$store.getters.cloudBBox(tag.title)
      const remainders = {
        x: this.canvas.width - cloudBox.width,
        y: this.canvas.height - cloudBox.height
      }
      // evaluate relevant axis for snapZoom
      const relevantDimension = {
        ...(remainders.x < remainders.y && { width: cloudBox.width + 100 }),
        ...(remainders.y < remainders.x && { height: cloudBox.height + 100 })
      }
      // zoom to fit and center
      window.setTimeout(() => {
        this.viewport.snapZoom({
          ...relevantDimension,
          center: new PIXI.Point(this.canvas.width/2, this.canvas.height/2),
          removeOnComplete: true,
          removeOnInterrupt: true,
          time: 1000,
          ease: 'easeInOutQuad'
        })
      }, 1500);




    //load all sample cutouts before spreading
    const loader = PIXI.Loader.shared;

    this.item.samples.forEach((sample, i) => {
      const fileName = sample.origin;
      const thumbName = `${sample.id}.jpg`;
      const sampleUrl = `${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName}`;
      if(!loader.resources[sampleUrl]) {
        loader.add(sampleUrl)
      }
    });
      
    loader.load(() => {
      
      //put all samples in the renderstack
      this.renderStack = this.item.samples;

      //preserve the currently visible sample at the top :/ not working ...
      /*const topMostSample = this.renderStack[this.renderStack.length-1];
      let renderStack = this.item.samples.map(d => d);
      renderStack.splice(renderStack.indexOf(topMostSample), 1);
      renderStack.push(topMostSample);
      this.renderStack = renderStack;*/


      //wait for vue to reflect the new renderStack as VizCloudSamples
      this.$nextTick(() => {

        TweenLite.to(this.itemContainer, 1, {
          x: 0,
          y: 0,
          ease: Power2.easeOut,
          delay: 1// + (this.$refs.cloudsamples.length * 0.025)
        });
        
        this.$refs.cloudsamples.forEach((cloudSample, i) => {
          const newPosition = this.$store.getters.positionInCloud(tag.title, cloudSample.sample.origin);

          //skip fade-in of samples
          cloudSample.sprite.alpha = 1;

          //update sample positions
          TweenLite.to(cloudSample.sprite, 1.5, {
            x: newPosition.x,
            y: newPosition.y,
            width: newPosition.size,
            height: newPosition.size,
            ease: Power2.easeOut,
            delay: 1// + (i*0.025)
          })            
        });

        //when the animation is done, finally switch to the actual tag view
        window.setTimeout(() => {
          this.$router.push({ path: `${this.subpath}/${this.item.id}` })
        }, 2500);
      })
    })



    
// ########## big mess for spread animation END ##########
    



















    //this.$router.push({ path: `${this.subpath}/${this.item.id}` })
  })
  samplesContainer.on('pointerover', () => {    
    itemContainer.zIndex = 1 // rendered above all other itemContainer's to ensure textBox visibility
    this.isHovered = true
  })
  samplesContainer.on('pointerout', () => {
    itemContainer.zIndex = 0 // back to default zIndex layer
    this.isHovered = false
  })

  itemContainer.addChild(samplesContainer)

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