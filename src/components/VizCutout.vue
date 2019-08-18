<template>
  <div class="cutout" ref="cutout">hello this is cutout {{geometry.x}} {{geometry.y}}</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TweenLite } from 'gsap/TweenMax'
import { sanitizeLabel, getOccurrenceUID } from '../utils.js'

export default {
  name: 'viz-cutout',
  sprite: null,
  props: ['tag', 'occurrence', 'geometry'],
  beforeMount: function() {
    
    //console.log("hello this is a cutout")


    let sprite = this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    //sprite.name = this.occurrence.origin
    sprite.x = 0//position.x
    sprite.y = 0//position.y
    sprite.alpha = 0

    //inherit size
    sprite.width = this.$parent.occurrenceContainer._width
    sprite.height = this.$parent.occurrenceContainer._height


    const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.geometry)
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    sprite.texture = PIXI.Texture.from(`assets/images/thumb/${filename}/${thumbName}`);

    // for development: adds a random tint that will be removed on load
    //sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
  },

  mounted: function() {
    // add children to respective containers
    this.$parent.occurrenceContainer.addChild(this.sprite)

    TweenLite.to(this.sprite, 1, {alpha: 1, ease: Power2.easeIn});

    //htmlviz
    const uid = getOccurrenceUID(this.tag.title, this.occurrence, this.geometry)
    const thumbName = `${uid}.jpg`;
    const filename = this.occurrence.origin;
    this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
  }
}
</script>

<style scoped lang="scss">
</style>
