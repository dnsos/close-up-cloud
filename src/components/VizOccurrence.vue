<template>
  <div class="obj" ref="cutout">
    <router-link :to="`/viz/detail/${occurrence.origin}`">
      occurrence {{occurrence.origin}}
    </router-link>

    <!--VizCutout v-for="(geometry, i) in occurrence.geometry" :occurrence="occurrence" :geometry="geometry" :tag="tag" :key="i" /-->
    <VizCutout :occurrence="occurrence" :geometry="occurrence.geometry[0]" :tag="tag" />

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import VizCutout from './VizCutout.vue'
import { getOccurrenceUID } from '../js/utils.js'

export default {
  name: 'viz-occurrence',
  props: ['tag', 'occurrence', 'position'],
  components: { VizCutout },
  occurrenceContainer: null,
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
      console.log('occurrenceContainer tap!');
      this.$router.push({ path: `/viz/detail/${this.occurrence.origin}` })
    })


    //htmlviz
    //this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
  },
  mounted: function() {
    
    this.$parent.tagContainer.addChild(this.occurrenceContainer)
  }
}
</script>

<style scoped lang="scss">
.obj {
    padding: 16px;
    margin: 16px;
    border: 1px solid #999;
}

.tile {
  width: 64px;
  height: 64px;
  background-size: cover;
  display: inline-block;
}
</style>
