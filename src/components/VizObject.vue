<template>
  <div class="obj" ref="cutout">
    <h4>hello, this is an occurrence {{occurrence.origin}}</h4>
    <VizCutout v-for="(geometry, i) in occurrence.geometry" :occurrence="occurrence" :geometry="geometry" :tag="tag" :key="i" />
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
    
    console.log("hello this is a single occurrence", this.occurrence)

    /*const uid = getOccurrenceUID(this.tag.title, this.occurrence)
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;*/
  }
}
</script>

<style scoped lang="scss">
.obj {
    padding: 32px;
    margin: 32px;
    border: 1px solid #999;
}
</style>
