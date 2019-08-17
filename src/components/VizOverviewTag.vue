<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Overview Tag {{tag.title}}</router-link>

    <VizOccurrence v-for="(occurrence) in renderStack" 
      :occurrence="occurrence" 
      :position="occurrence.position" 
      :tag="tag" 
      :key="tag.title + occurrence.origin" />

    <!-- @debug single occurence -->
    <!--VizOccurrence :occurrence="renderOccurrences[0]" :position="renderOccurrences[0].position" 
      :tag="tag" 
      :key="tag.title + renderOccurrences[0].origin" /-->
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
    tag: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      appendTimeout: null,
      renderIndex: 0, //index of next appended this.tag 
      renderStack: [] //array of occurencies to be rendered
    }
  },
  computed: {
    ...mapState(['PIXIApp', 'canvas', 'activeView'])
  },
  components: { VizOccurrence },
  tagContainer: null,
  methods: {
    
  },
  watch: {
  },
  beforeMount: function() {
    console.log("hello this is an overview tag")
    
    const tagContainer = this.tagContainer = new PIXI.Container();
    
    //@todo build layers and add text label
    
    //@todo get smarter
    const position = this.$store.getters.positionInCloud('overview', this.tag.title);
    tagContainer.x = position.x
    tagContainer.y = position.y
    tagContainer.width = position.size
    tagContainer.height = position.size

    // add interactivity
    tagContainer.interactive = true;
    tagContainer.buttonMode = true;
    tagContainer.on('pointertap', () => {
      
      //@todo better event prevent?
      if(this.$router.currentRoute.name !== 'overview') return;
      if(this.$store.state.isDragging) return;

      console.log('tagContainer tap!');
      this.$router.push({ path: `/viz/tag/${this.tag.title}` })
    })


    //@debug adds a sprite and random tint that will be removed on load
    /*let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size
    // add sprite
    tagContainer.addChild(sprite)*/
  },
  mounted: function() {
    
    this.$parent.cloudContainer.addChild(this.tagContainer);

    //@todo make more general
    //pushes new occurences to be loaded over time
    const appendOccurrance = () => {
      const occ = this.tag.occurrences[this.renderIndex];
      const position = this.$store.getters.positionInCloud('overview', this.tag.title);
      occ.position = {
        x: 0, y: 0, //positioned by this.tagContainer
        size: position.size
      }

      //clone renderOccurrences and add occ
      let renderStack = this.renderStack.map(d => d);
      renderStack.push(occ)      
      
      //only keep last two occurences
      if(renderStack.length > 2) {
        renderStack = renderStack.slice(renderStack.length-2);
      }

      //update render array
      this.renderStack = renderStack;

      //prepare appending next occurence
      if(this.tag.occurrences.length > 1) {
        this.renderIndex++;
        if(this.renderIndex === this.tag.occurrences.length) this.renderIndex = 0;

        this.appendTimeout = window.setTimeout(appendOccurrance, 8000 + ((-0.5 + Math.random())*2000));
      }
    }

    appendOccurrance();
  },
  beforeDestroy: function () {
      this.$parent.cloudContainer.removeChild(this.tagContainer)
      window.clearTimeout(this.appendTimeout);
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