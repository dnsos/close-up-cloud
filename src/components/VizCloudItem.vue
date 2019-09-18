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

    //deactivate interaction, animation only from this point
    samplesContainer.interactive = false;
    samplesContainer.buttonMode = false;












// #######################################################
// ########## big mess for spread animation START ########
// #######################################################






/**
 * Timeline of Spread Animation 
 * [0.0s – 0.5s] Hide all other CloudItems
 * [0.0s – 1.0s] Center the selected CloudItem
 * [1.0s – 2.5s] (after loading) Spread out all VizCloudSamples
 * [1.0s – 2.0s] (after loading) Center the next view
 * [1.5s – 2.5s] (after loading) Zoom viewport to fit the next view
 */

    // Hide all other CloudItems
    this.$parent.hideOtherItems(this.item.id);

    let targetBBox;

    // ##############################
    // # CLOUD TO CLOUD START
    // ##############################

    if(this.$route.name === 'viz-overview') {

      const tagTitle = this.item.id;
      const tag = this.$store.getters.tag(tagTitle)

      //only ever compute cloud layout once
      if(!this.$store.state.clouds[tagTitle]) {

        //prepare input data for occurences cloud
        const cloudItems = tag.occurrences.map(occ => {

          //per occurencant object: sample all geometries
          const samples = occ.geometry.map(geo => {
            const sample = {
              origin: occ.origin,
              x: geo.x,
              y: geo.y
            }
            sample.id = getCutoutUID(tagTitle, sample);
            return sample;
          });

          return {
            id: occ.origin,
            weight: samples.length,
            samples: samples
          }
        });

        this.$store.dispatch('computeForceLayout', {
          key: tagTitle,
          data: cloudItems
        });
      }
      
      //get size of next cloud
      targetBBox = this.$store.getters.cloudBBox(tagTitle)
  
    // ##############################
    // # CLOUD TO CLOUD END
    // ##############################
    
    } else if(this.$route.name === 'viz-tag') {

    // ##############################
    // # CLOUD TO DETAIL START
    // ##############################

      const object = this.$store.getters.object(this.item.id);
      const frame = object.tags.find(tag => tag.title === "Frame");
      targetBBox = frame.geometry[0];

    }
    // ##############################
    // # CLOUD TO DETAIL END
    // ##############################
    

  


    //Center the selected CloudItem
    TweenLite.to(this.itemContainer, 1, {
      x: -this.position.size/2,
      y: -this.position.size/2,
      ease: Power2.easeOut
    });








    //load all sample cutouts before spreading
    const loader = new PIXI.Loader();

    this.item.samples.forEach((sample) => {
      const fileName = sample.origin;
      const thumbName = `${sample.id}.jpg`;
      const sampleUrl = `${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName}`;
      if(!PIXI.utils.TextureCache[sampleUrl]) {
        loader.add(sampleUrl)
      }
    });
      
    loader.load(() => {
      
      //remember the currently visible cutout (last item in renderStack)
      const topMostSample = this.renderStack.pop();
      
      //empty the renderStack for one tick ... this is a hack to force Vue to re-mount 
      //all VizCutoutSamples in the desired order, so that topMostSample stays on top
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

          let detailDesiredZoom;

          //@todo centralize viewport zooming-to-fit
          
          if(this.$route.name === 'viz-overview') {
              
            //Zoom viewport to fit the next view
            const remainders = {
              x: this.canvas.width - targetBBox.width,
              y: this.canvas.height - targetBBox.height
            }
            //evaluate relevant axis for snapZoom
            const relevantDimension = {
              ...(remainders.x < remainders.y && { width: targetBBox.width + 100 }),
              ...(remainders.y < remainders.x && { height: targetBBox.height + 100 })
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

          } else if(this.$route.name === 'viz-tag') {

            const padding = 64;
            const canvasRatio = this.canvas.width / this.canvas.height;
            const frameRatio = targetBBox.width / targetBBox.height;

            let relevantDimension;
            if(frameRatio > canvasRatio) {
              detailDesiredZoom = (this.canvas.width - (padding*2)) / (targetBBox.width);
              relevantDimension = { width: this.canvas.width };
            } else {
              detailDesiredZoom = (this.canvas.height - (padding*2)) / (targetBBox.height);
              relevantDimension = { height: this.canvas.height };
            }

            // zoom to fit and center
            //window.setTimeout(() => {
              this.viewport.snapZoom({
                ...relevantDimension,
                center: new PIXI.Point(this.canvas.width/2, this.canvas.height/2),
                removeOnComplete: true,
                removeOnInterrupt: true
              })
            //}, 500);
          }








          //Undo the total centering of the CloudItem to prepare for perfect alignment with the following view
          //this should happen simultaniously to the spreading so users shouldn't notice
          if(this.$route.name === 'viz-overview') {
            TweenLite.to(this.itemContainer, 1, {
              x: 0,
              y: 0,
              ease: Power2.easeOut,
              delay: 1
            });
          } else if(this.$route.name === 'viz-tag') {
            TweenLite.to(this.itemContainer, 1, {
              x: -(targetBBox.width * detailDesiredZoom)/2,
              y: -(targetBBox.height * detailDesiredZoom)/2,
              ease: Power2.easeOut,
              delay: 1
            });
          }
          
          





          this.$refs.cloudsamples.forEach((cloudSample) => {

            let newPosition;

            if(this.$route.name === 'viz-overview') {
              newPosition = this.$store.getters.positionInCloud(this.item.id, cloudSample.sample.origin);
            } else if(this.$route.name === 'viz-tag') {
              newPosition = this.item.samples.find(sample => sample.id === cloudSample.sample.id);
              
              //subtract frame offset
              newPosition.x -= targetBBox.x;
              newPosition.y -= targetBBox.y;

              //apply scaling
              newPosition.x *= detailDesiredZoom;
              newPosition.y *= detailDesiredZoom;
              newPosition.size *= detailDesiredZoom;
            }

            //Spread out all VizCloudSamples
            TweenLite.to(cloudSample.sprite, 1.5, {
              x: newPosition.x,
              y: newPosition.y,
              width: newPosition.size,
              height: newPosition.size,
              ease: Power2.easeOut,
              delay: 1
            })
          });







          //when the animation is done, finally route to the target url and change views
          window.setTimeout(() => {
            this.$router.push({ path: `${this.subpath}/${this.item.id}` })
          }, 2500);
        })
      })

    })



// #######################################################
// ########## big mess for spread animation END ##########
// #######################################################
    



















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