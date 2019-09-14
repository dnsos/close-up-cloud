<template>
  <div class="cutout" ref="cutout">hello this is a sample</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TweenLite, Power2 } from 'gsap/TweenMax'

export default {
  name: 'viz-cutout',
  sprite: null,
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
    sprite.alpha = 0

    //inherit size
    sprite.width = this.$parent.samplesContainer._width
    sprite.height = this.$parent.samplesContainer._height

    const cutoutsRoot = process.env.VUE_APP_URL_IMG;
    const fileName = this.sample.origin;
    const thumbName = `${this.sample.id}.jpg`;
    const cutoutPath = `${cutoutsRoot}/${fileName}/${thumbName}`;

    const loader = new PIXI.Loader()

    if (!loader.resources[cutoutPath] || !PIXI.utils.TextureCache[cutoutPath]) {
      // add resource only if doesn't exist already
      // TODO: possible to avoid duplicates in TextureCache?
      loader.add(cutoutPath)
    }

    loader.load((loader, resources) => {
      sprite.texture = resources[cutoutPath].texture
      this.$parent.samplesContainer.addChild(this.sprite)
      TweenLite.to(this.sprite, 1, {alpha: 1, ease: Power2.easeIn})
    })

    //@debug add a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
  },

  mounted: function() {
    //htmlviz
    const path = process.env.VUE_APP_URL_IMG;
    const fileName = this.sample.origin;
    const thumbName = `${this.sample.id}.jpg`;
    this.$refs.cutout.style.backgroundImage = `url(${process.env.VUE_APP_URL_IMG}/${fileName}/${thumbName})`;
  }
}
</script>

<style scoped lang="scss">
</style>
