<template>
  <div class="cutout" ref="cutout">hello this is a sample</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TweenLite, Power2 } from 'gsap/TweenMax'
import { durations } from '../variables.js'

export default {
  name: 'viz-cutout',
  props: {
    id: { type: String, required: true },
    size: { type: Number }
  },
  data: function() {
    return {
        sprite: null
    }
  },
  beforeMount: function() {
    
    //console.log("hello this is a sample");

    let sprite = this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.width = this.size;
    sprite.height = this.size;
    //@debug add a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    //assuming the texture is already preloaded
    if(PIXI.utils.TextureCache[this.id]) {
      sprite.texture = PIXI.utils.TextureCache[this.id]

      if(!this.$store.state.skipFadeIn) {
        sprite.alpha = 0
        TweenLite.to(sprite, durations.sampleFadeIn, {alpha: 1, ease: Power2.easeInOut})
      }
      
    } else {
      console.error('Texture not found', this.id)
    }
  },

  mounted: function() {
    this.$parent.samplesContainer.addChild(this.sprite)

    //htmlviz
    //this.$refs.cutout.style.backgroundImage = `url(${this.url})`;
  },
  beforeDestroy: function () {
    this.$parent.samplesContainer.removeChild(this.sprite)
  }
}
</script>

<style scoped lang="scss">
</style>
