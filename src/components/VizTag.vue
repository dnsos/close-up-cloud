<template>
  <div class="tag">
    <h3>hello this is {{tag.title}}</h3>
    <VizObject v-for="occurrence in tag.occurrences" :occurrence="occurrence" :tag="tag" :key="occurrence.origin" />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import VizObject from './VizObject.vue'

export default {
  name: 'viz-tag',
  props: ['id', 'tag'],
    components: { VizObject },
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
  mounted: function() {
    
    console.log("hello this is a single tag", this.tag.occurrences[0].origin)
  }
}
</script>

<style scoped lang="scss">
.tag {
    padding: 32px;
    background: #eee;
    margin: 32px;
}
</style>
