<template>
  <div class="cutout" ref="cutout">hello this is cutout {{geometry.x}} {{geometry.y}}</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { sanitizeLabel, getOccurrenceUID } from '../js/utils.js'

export default {
  name: 'viz-cutout',
  props: ['tag', 'occurrence', 'geometry'],
  mounted: function() {
    
    console.log("hello this is a single occurrence", this.occurrence)

    const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.geometry)
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
  }
}
</script>

<style scoped lang="scss">
.cutout {
    width: 128px;
    height: 128px;
    display: inline-block;
    margin: 8px;
    word-break: break-word;
    line-height: 1;
    overflow: hidden;
    background-size: cover;
}
</style>
