<template>
  <div class="obj" ref="cutout">
    <router-link :to="`/viz/detail/${occurrence.origin}`">
      occurrence {{occurrence.origin}}
    </router-link>

    <VizCutout v-for="geometry in renderStack" 
      :occurrence="occurrence" 
      :geometry="geometry" 
      :tag="tag" 
      :key="`${occurrence.origin}-${tag.title}-${geometry.x}-${geometry.y}`" />
    
    <!-- @debug single cutout -->
    <!--VizCutout :occurrence="occurrence" :geometry="occurrence.geometry[0]" :tag="tag" /-->

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import VizCutout from './VizCutout.vue'
import { getOccurrenceUID } from '../utils.js'

//@todo refactor, only for demo purposes ... 
export default {
  name: 'viz-occurrence',
  props: ['tag', 'occurrence', 'position'],
  components: { VizCutout },
  occurrenceContainer: null,
  data: function() {
    return {
      appendTimeout: null,
      renderIndex: 0, //index of next appended this.tag 
      renderStack: [] //array of occurencies to be rendered
    }
  },
  methods: {
    //@todo exclude, make more general
    //pushes new occurences to be loaded over time
    appendNext: function() {
      const occ = this.occurrence.geometry[this.renderIndex];
      const position = this.$store.getters.positionInCloud(this.tag.title, this.occurrence.origin);
      occ.position = {
        x: 0, y: 0, //positioned by this.occurrenceContainer
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
      if(this.occurrence.geometry.length > 1) {
        this.renderIndex++;
        if(this.renderIndex === this.occurrence.geometry.length) this.renderIndex = 0;

        this.appendTimeout = window.setTimeout(this.appendNext, 5000 + ((-0.5 + Math.random())*2000));
      }
    }
  },
  beforeMount: function() {
    
    console.log("hello this is an occurrence")
    const position = this.position

    const occurrenceContainer = this.occurrenceContainer = new PIXI.Container()
    //occurrenceContainer.name = 'occurrenceContainer'
    occurrenceContainer.x = position.x
    occurrenceContainer.y = position.y
    occurrenceContainer.width = position.size
    occurrenceContainer.height = position.size
    
    //@todo get smarter
    //const position = this.$store.getters.positionInCloud(this.tag.title, this.occurrence.origin);
    //const position = this.$store.getters.positionInCloud('overview', this.tag.title);
    
    //@todo render sprites on cutout level
    /*let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.name = this.occurrence.origin
    sprite.x = 0//position.x
    sprite.y = 0//position.y

    //inherit size

    const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.occurrence.geometry[0])
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    sprite.texture = PIXI.Texture.from(`assets/images/thumb/${filename}/${thumbName}`);

    // for development: adds a random tint that will be removed on load
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // add children to respective containers
    occurrenceContainer.addChild(sprite)*/




    // add interactivity
    occurrenceContainer.interactive = true;
    occurrenceContainer.buttonMode = true;
    occurrenceContainer.on('pointertap', () => {
      if(this.$router.currentRoute.name !== 'tag') return;
      if(this.$store.state.isDragging) return;
      console.log('occurrenceContainer tap!');
      this.$router.push({ path: `/viz/detail/${this.occurrence.origin}` })
    })


    //htmlviz
    //this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
  },
  mounted: function() {
    
    this.$parent.tagContainer.addChild(this.occurrenceContainer)
    
    //first append: mix it up a lil
    window.setTimeout(this.appendNext, Math.random()*1000);
  },
  beforeDestroy: function () {
      this.$parent.tagContainer.removeChild(this.occurrenceContainer)
      window.clearTimeout(this.appendTimeout);
  }
}
</script>

<style scoped lang="scss">
</style>
