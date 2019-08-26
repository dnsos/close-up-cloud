<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${item.id}`">Cloud item {{item.id}}</router-link>

    <VizCloudSample v-for="sample in renderStack" 
      :sample="sample" 
      :item="item" 
      :key="`${sample.id}`" />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { textStyle } from '../variables'
import VizCloudSample from './VizCloudSample.vue'

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
      appendTimeout: null,
      renderIndex: 0, //index of next appended item
      renderStack: [] //array of items that are rendered
    }
  },
  components: { VizCloudSample },
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

    this.appendTimeout = window.setTimeout(this.appendNext, 6000);
    }
  }
  },
  watch: {
  },
  beforeMount: function() {
  //console.log("hello this is a cloud item")
 
  // itemContainer stores samplesContainer and textBox
  const itemContainer = this.itemContainer = new PIXI.Container();
  //itemContainer.sortableChildren = true

  // samplesContainer will store all sprites from VizCloudSample.vue
  const samplesContainer = this.samplesContainer = new PIXI.Container();
  samplesContainer.name = 'samplesContainer'
  itemContainer.addChild(samplesContainer)
  
  const position = this.$store.getters.positionInCloud(this.cloudname, this.item.id);
  itemContainer.x = position.x
  itemContainer.y = position.y
  itemContainer.width = position.size
  itemContainer.height = position.size
  
  const textBox = new PIXI.Container();
  textBox.name = 'textBox'
  textBox.alpha = 0
  textBox.x = 0
  textBox.y = position.size

  // text content depending on active view
  const textOverview = this.item.weight + ' ' + this.item.id
  let textTagview = ''

  if (this.cloudname != 'overview') {
    const tagData = this.$store.getters.tag(this.cloudname)
    const originTitle = this.$store.getters.object(this.item.id).title
    const originCount = tagData.occurrences.find(occurrence => occurrence.origin === this.item.id).geometry.length
    textTagview = originCount + ' ' + tagData.title + '\n' + 'in ' + originTitle
  }
  
  const textContent = this.cloudname === 'overview' ? textOverview : textTagview
  const tagTitle = new PIXI.Text(textContent, textStyle.medium)
  tagTitle.x = 5

  const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
  txtBG.width = tagTitle.width + 10;
  txtBG.height = tagTitle.height;
  textBox.addChild(txtBG, tagTitle);
  itemContainer.addChild(textBox)

  // samplesContainer is interactive to avoid events
  // on itemContainer (that also stores textBox)
  samplesContainer.interactive = true;
  samplesContainer.buttonMode = true;

  samplesContainer.on('pointertap', () => {
    if(this.$store.state.isDragging) return;
      console.log('itemContainer tap!', this.item);
      this.$router.push({ path: `${this.subpath}/${this.item.id}` })
  })
  samplesContainer.on('pointerover', () => {
    if(this.$store.state.isDragging) return

    // workaround for maintaining original text size
    // TODO: move to resize watcher / other solution in general?
    const scaleInverted = 1 / this.$parent.viewport.transform.scale.x
    textBox.scale = new PIXI.Point(scaleInverted, scaleInverted)
    
    itemContainer.zIndex = 1 // rendered above all other itemContainer's to ensure textBox visibility

    textBox.alpha = 1
  })
  samplesContainer.on('pointerout', () => {
    if(this.$store.state.isDragging) return

    itemContainer.zIndex = 0 // back to default zIndex layer

    textBox.alpha = 0
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