<template>
  <div class="tooltip">hello this is a tooltip</div>
</template>

<script>
import { Container, Sprite, Texture, Point, Text } from 'pixi.js'
import { textStyle } from '../variables'
import { TweenLite, Power2 } from 'gsap/TweenMax'

export default {
  name: 'viz-tooltip',
  props: {
    content: { type: String, required: true },
    yOffset: { type: Number, required: false, default: 0 }
  },
  data: function() {
    return {
      textBox: null
    }
  },
  computed: {
    isHovered: function () {
      /*
        TODO: Resolve bug:
        In itemContainer pointerover events are occasionally triggered when they are not supposed to.
        Results in isHovered returning true and textBox appearing.
        Might be related to the setTimeout function?
      */
      return this.$parent.isHovered
    },
    viewportScale: function () {
      // keep track of main viewport scale
      return this.$parent.$parent.viewport.transform.scale.x
    }
  },
  watch: {
    isHovered: function (newValue) {
      this.textBox.alpha = (newValue === true) ? 1 : 0
      //TweenLite.to(this.textBox, .05, {alpha: newAlpha, ease: Power2.easeIn})
    },
    viewportScale: function (newValue) {
      // update textBox scale to inverted value of main viewport scale
      const scaleInverted = 1 / newValue
      this.textBox.scale = new Point(scaleInverted, scaleInverted)
    }
  },
  beforeMount: function() {

    const textBox = this.textBox = new Container()
    textBox.name = 'textBox'
    textBox.alpha = 0
    textBox.x = 0
    textBox.y = this.yOffset

    const tagTitle = new Text(this.content, textStyle.medium)
    tagTitle.roundPixels = true
    tagTitle.y = 5
    tagTitle.x = 5

    const txtBG = new Sprite(Texture.WHITE)
    txtBG.width = tagTitle.width + 10
    txtBG.height = tagTitle.height + 10

    textBox.addChild(txtBG, tagTitle)
  },

  mounted: function() {
    this.$parent.itemContainer.addChild(this.textBox)
  }
}
</script>

<style>
</style>
