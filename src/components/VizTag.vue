<template>
  <div class="tag">
    <h3>Tag {{tag.title}}</h3>
    <!--VizObject v-for="(occurrence, i) in tag.occurrences" :occurrence="occurrence" :tag="tag" :key="tag.title + occurrence.origin + i" /-->
    <VizObject :occurrence="tag.occurrences[0]" :tag="tag"  />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import VizObject from './VizObject.vue'

export default {
  name: 'viz-tag',
  props: ['id', 'tag'],
  components: { VizObject },
  tagContainer: null,
  tagPosition: null,
  methods: {
      load() {
      },
      spreadTags() {
      },
      spreadCutouts() {
      },
      goToDetail() {
      }
  },
  beforeMount: function() {
    console.log("hello this is a tag")

    const position = this.$store.getters.positionInCloud('overview', this.tag.title);

    if(!position) {
      console.Error('no position found for', this.tag)
      return
    }
    
    const tagContainer = this.tagContainer = new PIXI.Container();
    tagContainer.name = this.tag.title
    tagContainer.x = position.x
    tagContainer.y = position.y

    let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size

    // for development: adds a random tint that will be removed on load
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // add sprite
    tagContainer.addChild(sprite)

    //@todo make sure single tag view mount is possible
    this.$parent.cloudContainer.addChild(tagContainer);
  },
  mounted: function() {
  }
}
</script>

<style scoped lang="scss">
.tag {
    padding: 16px;
    background: #eee;
    margin: 16px;
}
</style>
