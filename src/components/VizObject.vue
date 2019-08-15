<template>
  <div class="obj" ref="cutout">
    <h4>hello, this is an occurrence {{occurrence.origin}}</h4>
    <!--VizCutout v-for="(geometry, i) in occurrence.geometry" :occurrence="occurrence" :geometry="geometry" :tag="tag" :key="i" /-->
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import VizCutout from './VizCutout.vue'
import { sanitizeLabel, getOccurrenceUID } from '../js/utils.js'

export default {
  name: 'viz-cutout',
  props: ['tag', 'occurrence'],
  components: { VizCutout },
  mounted: function() {
    
    console.log("hello this is an occurrence")

    const occurrenceContainer = new PIXI.Container()
    occurrenceContainer.name = 'occurrenceContainer'

    const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.occurrence.geometry[0])
    const position = this.$store.getters.positionInCloud('overview', this.tag.title);

    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;


    let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.name = this.occurrence.origin
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size
    sprite.texture = PIXI.Texture.from(`assets/images/thumb/${filename}/${thumbName}`);

    // for development: adds a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // add children to respective containers
    occurrenceContainer.addChild(sprite)

    this.$parent.tagContainer.addChild(occurrenceContainer)

    //this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
  }
}
</script>

<style scoped lang="scss">
.obj {
    padding: 16px;
    margin: 16px;
    border: 1px solid #999;
}
</style>
