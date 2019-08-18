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
    
    console.log("hello this is a sample");

    let sprite = this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.alpha = 0

    //inherit size
    sprite.width = this.$parent.itemContainer._width
    sprite.height = this.$parent.itemContainer._height

    const path = process.env.VUE_APP_URL_IMG;
    const fileName = this.sample.origin;
    const thumbName = `${this.sample.id}.jpg`;
    sprite.texture = PIXI.Texture.from(`${path}/${fileName}/${thumbName}`);

    //@debug add a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
  },

  mounted: function() {
    // add children to respective containers
    this.$parent.itemContainer.addChild(this.sprite)

    TweenLite.to(this.sprite, 1, {alpha: 1, ease: Power2.easeIn});

    //htmlviz
    /*const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.geometry)
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    this.$refs.cutout.style.backgroundImage = `url(${process.env.VUE_APP_URL_IMG}/${filename}/${thumbName})`;*/
  }
}
</script>

<style scoped lang="scss">
</style>
