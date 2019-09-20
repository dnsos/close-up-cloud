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
      fauxDetail: null,
      samplesContainer: null,
      renderIndex: 0, //index of next appended item
      renderStack: [], //array of items that are rendered
      isHovered: false
    }
  },
  components: { VizCloudSample, VizTooltip },
  computed: {
    ...mapState(['canvas', 'viewport', 'renderer']),
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


    // #########################################################
    // ########## big mess for spread animation START ##########
    // #########################################################
    //
    // Order of Spread Animation:
    // [1] Hide all other CloudItems
    // [2] Center the selected CloudItem
    // [3] Pre-Load Samples
    // [4] Zoom viewport to fit the next view
    // [5] Align Samples with the next view
    // [6] Spread out all VizCloudSamples
    // [7] Route to the target view
    //

    const loader = new PIXI.Loader();
    const isCloudToCloud = (this.$route.name === 'viz-overview') ? true : false;
    const isCloudToDetail = (this.$route.name === 'viz-tag') ? true : false;
    
    let nextCloudBBox; //dimensions of the upcoming cloud (cloud-to-cloud)
    let detailFrameBBox; //dimensions of the upcoming detail image (cloud-to-detail)
    let detailScaleFactor; //scaling factor of the upcoming detail image (cloud-to-detail)


    //for cloud-to-cloud, we have to compute the next cloud layout first    
    if(isCloudToCloud) {

      //@todo exclude
      const tag = this.$store.getters.tag(this.item.id)

      //only ever compute cloud layout once
      if(!this.$store.state.clouds[tag.title]) {

        //prepare input data for occurences cloud
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
      
      //get size of next cloud
      nextCloudBBox = this.$store.getters.cloudBBox(tag.title)
  
    
    //for cloud-to-detail, let's gather some size information
    } else if(isCloudToDetail) {

      const targetObject = this.$store.getters.object(this.item.id);
      const frame = targetObject.tags.find(tag => tag.title === "Frame");
      detailFrameBBox = frame.geometry[0];
      detailScaleFactor = this.renderer.getDetailScaleFactor(detailFrameBBox);
    }
    


    // [1] Hide all other CloudItems
    this.$parent.hideOtherItems(this.item.id);



    // [2] Center the selected CloudItem
    TweenLite.to(this.itemContainer, 1, {
      x: -this.position.size/2,
      y: -this.position.size/2,
      ease: Power2.easeOut
    });



    // [3] Pre-Load Samples
    this.item.samples.forEach((sample) => {
      const fileName = sample.origin;
      const thumbName = `${sample.id}.jpg`;
      const sampleUrl = `${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName}`;
      if(!PIXI.utils.TextureCache[sampleUrl]) {
        loader.add(sampleUrl)
      }
    });
       
    //cloud-to-detail: also pre-load the detail image
    if(isCloudToDetail && !PIXI.utils.TextureCache[this.item.id]) {
      loader.add(this.item.id, `${process.env.VUE_APP_URL_IMG}/${this.item.id}/${this.item.id}-Frame.jpg`)
    }
      
    loader.load(() => {
      
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
          
          // [4] Zoom viewport to fit the next view
          if(isCloudToCloud) {
            window.setTimeout(() => {
              this.renderer.zoomToFitBBox(nextCloudBBox);
            }, 1500);
          } else if(isCloudToDetail) {
            this.renderer.zoomToFitBBox(this.canvas);
          }



          // [5] Align Samples with the next view
          //Undo the total centering of the CloudItem ([2]) to prepare for perfect alignment with the following view
          //this should happen simultaniously to the spreading so users won't notice
          TweenLite.to(this.itemContainer, 1, {
            x: 0,
            y: 0,
            ease: Power2.easeOut,
            delay: 1
          });



          // [6] Spread out all VizCloudSamples
          this.$refs.cloudsamples.forEach((cloudSample) => {

            let newPosition;

            if(isCloudToCloud) {
              newPosition = this.$store.getters.positionInCloud(this.item.id, cloudSample.sample.origin);
            } else if(isCloudToDetail) {
              newPosition = this.item.samples.find(sample => sample.id === cloudSample.sample.id);
              
              //subtract frame offset
              newPosition.x -= detailFrameBBox.x;
              newPosition.y -= detailFrameBBox.y;

              //subtract half size
              newPosition.x -= detailFrameBBox.width/2;
              newPosition.y -= detailFrameBBox.height/2;

              //apply scaling
              newPosition.x *= detailScaleFactor;
              newPosition.y *= detailScaleFactor;
              newPosition.size *= detailScaleFactor;
            }

            TweenLite.to(cloudSample.sprite, 1.5, {
              x: newPosition.x,
              y: newPosition.y,
              width: newPosition.size,
              height: newPosition.size,
              ease: Power2.easeOut,
              delay: 1
            })
          });


          //fade-in detail image
          if(isCloudToDetail) {
            
            const sprite = this.fauxDetail = new PIXI.Sprite()
            sprite.alpha = 0;
            sprite.anchor.set(0.5);
            sprite.position.set(this.canvas.width/2, this.canvas.height/2)
            sprite.texture = PIXI.utils.TextureCache[this.item.id]
            
            //apply scaling to stay within viewport dimensions
            sprite.width = detailFrameBBox.width * detailScaleFactor;
            sprite.height = detailFrameBBox.height * detailScaleFactor;
            this.viewport.addChild(sprite) 
            
            TweenLite.to(sprite, 1.5, {
              alpha: 1,
              delay: 2.5
            });
          }



          // [7] Route to the target view
          //when the animation is done, finally route to the target url and change views
          //cloud-to-detail takes a bit longer because of the detail fade-in
          let routerAfterMs = isCloudToCloud ? 2500 : 4000;
          window.setTimeout(() => {
            this.$router.push({ path: `${this.subpath}/${this.item.id}` })
          }, routerAfterMs);

        }) //nextTick
      }) //nextTick
    }) //loader.load

    // #######################################################
    // ########## big mess for spread animation END ##########
    // #######################################################


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
    if(this.fauxDetail) this.viewport.removeChild(this.fauxDetail)
  }
}
</script>

<style scoped lang="scss">
</style>