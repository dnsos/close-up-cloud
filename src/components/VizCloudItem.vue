<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${item.id}`">Cloud item {{item.id}}</router-link>

    <VizSample v-for="sample in renderStack" 
      :sample="sample" 
      :item="item" 
      :key="`${sample.id}`" />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TimelineMax, TweenMax } from 'gsap/TweenMax'
import VizSample from './VizSample.vue'

export default {
  name: 'viz-cloud-item',
  props: {
    item: { type: Object, required: true },
    cloudname: { type: String, required: true },
  },
  data: function() {
    return {
      itemContainer: null,
      appendTimeout: null,
      renderIndex: 0, //index of next appended item
      renderStack: [] //array of items that are rendered
    }
  },
  components: { VizSample },
  methods: {
    appendNext: function() {

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

      //prepare next append
      if(this.item.samples.length > 1) {
        this.renderIndex++;
        if(this.renderIndex === this.item.samples.length) this.renderIndex = 0;

        this.appendTimeout = window.setTimeout(this.appendNext, 6000 + ((-0.5 + Math.random())*2000));
      }
    }
  },
  watch: {
  },
  beforeMount: function() {
    console.log("hello this is a cloud item")
    
    const itemContainer = this.itemContainer = new PIXI.Container();
    
    //@todo build layers and add text label
    /*
    // create tag title
    const textBox = new PIXI.Container();
    textBox.name = 'textBox'
    textBox.alpha = 0
    textBox.x = 5
    textBox.y = 5
    //textBox.parentLayer = infoLayer;
    
    const textContent = tag.tagCount + ' ' + tag.title + '\n' + 'in ' + tag.objectCount + ' Objekten'
    const tagTitle = new PIXI.Text(textContent, textStyle)
    tagTitle.name = tag.title
    tagTitle.x = 5

    const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
    txtBG.width = tagTitle.width + 10;
    txtBG.height = tagTitle.height;
    textBox.addChild(txtBG, tagTitle);
    itemContainer.addChild(textBox)
    // add events
    occurrencesContainer.on('pointerover', () => {
      textBox.alpha = 1
    })
    occurrencesContainer.on('pointerout', () => {
      textBox.alpha = 0
    })
    */
    
    const position = this.$store.getters.positionInCloud(this.cloudname, this.item.id);
    itemContainer.x = position.x
    itemContainer.y = position.y
    itemContainer.width = position.size
    itemContainer.height = position.size

    // @todo add interactivity
    /*itemContainer.interactive = true;
    itemContainer.buttonMode = true;
    itemContainer.on('pointertap', () => {
      
      //@todo better event prevent?
      if(this.$router.currentRoute.name !== 'overview') return;
      if(this.$store.state.isDragging) return;

      console.log('itemContainer tap!');
      this.$router.push({ path: `/viz/tag/${this.tag.title}` })
    })*/


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
    
    //first append: mix it up a lil
    window.setTimeout(this.appendNext, Math.random()*1000);
  },
  beforeDestroy: function () {
      this.$parent.cloudContainer.removeChild(this.itemContainer)
      window.clearTimeout(this.appendTimeout);
  }
}
</script>

<style scoped lang="scss">
</style>