<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Overview Tag {{tag.title}}</router-link>

    <VizOccurrence :occurrence="occurrencesWithPositions[0]" :position="occurrencesWithPositions[0].position" :tag="tag" />
  </div>
  
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizOccurrence from './VizOccurrence.vue'

export default {
  name: 'viz-tag',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
      isSpread: false
    }
  },
  computed: {
    ...mapState(['PIXIApp', 'canvas', 'activeView']),
    occurrencesWithPositions: function() {
      return this.tag.occurrences.map((occurrence) => {
        const position = this.$store.getters.positionInCloud('overview', this.tag.title);
        occurrence.position = {
          x: 0,
          y: 0,
          size: position.size
        }
        return occurrence;
      })
    }
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
    //tagContainer.name = this.tag.title
    
    //@todo get smarter
    const position = this.$store.getters.positionInCloud('overview', this.tag.title);

    console.log(this.tag.title, position)
    
    tagContainer.x = position.x
    tagContainer.y = position.y
    tagContainer.width = position.size
    tagContainer.height = position.size

    // add interactivity
    tagContainer.interactive = true;
    tagContainer.buttonMode = true;
    tagContainer.on('pointertap', () => {
      console.log(this.$router.currentRoute)
      if(this.$router.currentRoute.name !== 'overview') return;
      console.log('tagContainer tap!');
      this.$router.push({ path: `/viz/tag/${this.tag.title}` })
    })


    //@todo render sprites on cutout level
    /*let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size

    // for development: adds a random tint that will be removed on load
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // add sprite
    tagContainer.addChild(sprite)*/
  },
  mounted: function() {
    
    //@todo make mounting bullet proof
    this.$parent.cloudContainer.addChild(this.tagContainer);
  },
  beforeDestroy: function () {
      this.PIXIApp.stage.removeChild(this.tagContainer)
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
