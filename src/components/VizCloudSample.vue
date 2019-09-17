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
    sample: { type: Object, required: true },
    item: { type: Object, required: true }
  },
  data: function() {
    return {
        sprite: null
    }
  },
  beforeMount: function() {
    
    //console.log("hello this is a sample");

    let sprite = this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    //sprite.alpha = 0

    //@debug add a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    //inherit size
    sprite.width = this.$parent.samplesContainer._width
    sprite.height = this.$parent.samplesContainer._height

    const fileName = this.sample.origin;
    const thumbName = `${this.sample.id}.jpg`;
    const cutoutPath = `${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName}`;

    //load texture and fade in
    const loader = PIXI.Loader.shared;
    if(loader.resources[cutoutPath]) {
      sprite.texture = loader.resources[cutoutPath].texture
      this.$parent.samplesContainer.addChild(sprite)
      //TweenLite.to(sprite, durations.sampleFadeIn, {alpha: 1, ease: Power2.easeInOut})
    } else {
      console.error('Texture not found', cutoutPath)
    }
  },

  mounted: function() {
    //htmlviz
    const fileName = this.sample.origin;
    const thumbName = `${this.sample.id}.jpg`;
    this.$refs.cutout.style.backgroundImage = `url(${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName})`;
  },
  beforeDestroy: function () {
    this.$parent.samplesContainer.removeChild(this.sprite)
  }
}
</script>

<style scoped lang="scss">
</style>
