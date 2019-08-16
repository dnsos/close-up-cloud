<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Tag {{tag.title}}</router-link>

    <!--template v-if="this.activeView === 'tag'">
      <VizOccurrence v-for="(occurrence, i) in tag.occurrences" :occurrence="occurrence" :tag="tag" :key="tag.title + occurrence.origin + i" />
    </template>
    <template v-else-if="this.activeView === 'cloud'">
      <VizOccurrence :occurrence="tag.occurrences[0]" :tag="tag" />
    </template-->
    <VizOccurrence :occurrence="tag.occurrences[0]" :tag="tag" />
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
      default: function() {
        //in case we get no tag prop passed down, try to fetch it from the store
        if(this.$route.params.id) {
          return this.$store.getters.tag(this.$route.params.id)
        }
      }
    }
  },
  data: () => {
    return {
      isSpread: false
    }
  },
  computed: mapState(['PIXIApp', 'activeView']),
  components: { VizOccurrence },
  tagContainer: null,
  methods: {
    initForceLayout() {
      if(!this.$store.state.clouds[this.tag.title]) {
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
    spread() {
    },
    goToDetail() {
    }
  },
  beforeMount: function() {
    console.log("hello this is a tag")
    
    const tagContainer = this.tagContainer = new PIXI.Container();
    tagContainer.name = this.tag.title
    
    //@todo get smarter
    let position = {x: 0, y: 0, size: 320}
    if(this.$router.currentRoute.path === '/viz') {
      position = this.$store.getters.positionInCloud('overview', this.tag.title);
    }
    
    tagContainer.x = position.x
    tagContainer.y = position.y
    tagContainer.width = position.size
    tagContainer.height = position.size


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


    //@todo make mounting bullet proof
    if(this.$parent.cloudContainer) {
      this.$parent.cloudContainer.addChild(tagContainer);
    } else {
      this.PIXIApp.stage.addChild(tagContainer);
    }
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
