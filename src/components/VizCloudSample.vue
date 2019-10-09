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
    size: { type: Number, required: true, default: 0 }
  },
  data: function() {
    return {
        sprite: null
    }
  },
  beforeMount: function() {
    
    //console.log("hello this is a sample");

    let sprite = this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.width = sprite.height = this.size;

    //assuming the texture is already preloaded
    if(PIXI.utils.TextureCache[this.id]) {
      sprite.texture = PIXI.utils.TextureCache[this.id]

      //if we came via vizTransition, skip fade-in
      if(!this.$store.state.isTransitioning) {
        sprite.alpha = 0
        TweenLite.to(sprite, durations.sampleFadeIn, {alpha: 1, ease: Power2.easeInOut})
      }
      
    } else {
      console.error('Texture not found', this.id)
    }
  },

  mounted: function() {
    this.$parent.samplesContainer.addChild(this.sprite)
  },
  beforeDestroy: function () {
    this.$parent.samplesContainer.removeChild(this.sprite)
  },
  destroyed: function() {
    //@todo this breaks stuff
    //this.sprite.destroy(true);
  }
}
</script>

<style scoped lang="scss">
</style>
