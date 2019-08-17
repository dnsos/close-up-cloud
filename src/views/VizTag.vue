<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Tag {{tag.title}}</router-link>

    <VizOccurrence v-for="(occurrence, i) in occurrencesWithPositions" 
      :occurrence="occurrence" 
      :position="occurrence.position" 
      :tag="tag" 
      :key="tag.title + occurrence.origin + i" />    

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizOccurrence from '../components/VizOccurrence.vue'

export default {
  name: 'viz-tag',
  props: {
    tag: {
      type: Object,
      default: function() {
        return this.$store.getters.tag(this.$route.params.id)
      }
    }
  },
  data: () => {
    return {
      isSpread: false
    }
  },
  computed: {
    ...mapState(['PIXIApp', 'canvas', 'viewport']),
    occurrencesWithPositions: function() {
      return this.tag.occurrences.map((occurrence) => {
        occurrence.position = this.$store.getters.positionInCloud(this.tag.title, occurrence.origin);
        return occurrence;
      })
    }
  },
  components: { VizOccurrence },
  tagContainer: null,
  methods: {
    initForceLayout() {

      //only ever compute once
      if(this.$store.state.clouds[this.tag.title]) return;

      const forceInput = this.tag.occurrences.map((occurrence) => {
        return {
          id: occurrence.origin, 
          weight: occurrence.geometry.length
        }
      })
      this.$store.dispatch('computeForceLayout', {
          key: this.tag.title,
          data: forceInput
      });
    }
  },
  watch: {
      canvas(newval, oldval) {
          //center tagContainer
          if(this.$router.currentRoute.name === 'tag') {
            if(this.tagContainer) {
                this.tagContainer.position.set(newval.width/2, newval.height/2)
            }

            //zoom to fit
            const cloudBox = this.$store.getters.cloudBBox(this.tag.title);
            const zoom = this.$store.getters.viewportZoom(cloudBox);            
            this.viewport.setZoom(zoom, true)
          }
      }
  },
  beforeMount: function() {
    
    const tagContainer = this.tagContainer = new PIXI.Container();
    tagContainer.name = this.tag.title    
    tagContainer.x = 0
    tagContainer.y = 0

    this.initForceLayout();

    // add interactivity
    /*tagContainer.interactive = true;
    tagContainer.buttonMode = true;
    tagContainer.on('pointertap', () => {
      console.log(this.$router.currentRoute)
      if(this.$router.currentRoute.name !== 'overview') return;
      if(this.$store.state.isDragging) return;
      console.log('tagContainer tap!');
      this.$router.push({ path: `/viz/tag/${this.tag.title}` })
    })*/


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
    
    
    
        //@todo on late mount watch:canvas is not triggered so this is duplicated here
    if(this.canvas.height) {

      //center
      this.tagContainer.position.set(this.canvas.width/2, this.canvas.height/2)

      //zoom to fit
      const cloudBox = this.$store.getters.cloudBBox(this.tag.title);
      const zoom = this.$store.getters.viewportZoom(cloudBox);
      this.viewport.setZoom(zoom, true)
    }

    this.viewport.addChild(this.tagContainer);
  },
  beforeDestroy: function () {
      this.viewport.removeChild(this.tagContainer)
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
