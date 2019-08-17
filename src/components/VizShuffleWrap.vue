<template>
  <div class="shuffle">    
    <template v-for="item in renderStack">
        <slot :item="item"></slot>
    </template>
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TimelineMax, TweenMax } from 'gsap/TweenMax'
import VizOccurrence from './VizOccurrence.vue'

export default {
  name: 'viz-tag',
  props: {
    items: { type: Array, required: true }
  },
  data: function() {
    return {
      appendTimeout: null,
      renderIndex: 0, //index of next appended this.tag 
      renderStack: [] //array of occurencies to be rendered
    }
  },
  container: null,
  methods: {

    //@todo possible to write with Generator / yield?
    appendNext: function() {

      const nextItem = this.items[this.renderIndex];
      /*const position = this.$store.getters.positionInCloud('overview', this.tag.title);
      occ.position = {
        x: 0, y: 0, //positioned by this.tagContainer
        size: position.size
      }*/

      //clone renderOccurrences and add occ
      let renderStack = this.renderStack.map(d => d);
      renderStack.push(nextItem)      
      
      //only keep last two occurences
      if(renderStack.length > 2) {
        renderStack = renderStack.slice(renderStack.length-2);
      }

      //update render array
      this.renderStack = renderStack;

      //prepare appending next occurence
      if(this.items.length > 1) {
        this.renderIndex++;
        if(this.renderIndex === this.items.length) this.renderIndex = 0;
        this.appendTimeout = window.setTimeout(this.appendNext, 8000 + ((-0.5 + Math.random())*2000));
      }
    }
  },
  beforeMount: function() {
    console.log("hello this is a shuffle wrapper")
    
    this.container = new PIXI.Container();
  },
  mounted: function() {
    
    this.$parent.cloudContainer.addChild(this.tagContainer);

    this.appendNext();
  },
  beforeDestroy: function () {
      this.$parent.cloudContainer.removeChild(this.tagContainer)
      window.clearTimeout(this.appendTimeout);
  }
}
</script>

<style scoped lang="scss">
</style>