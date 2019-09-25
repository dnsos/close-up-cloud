<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
    <VizDetailInteract :object="object" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, TimelineLite, Power2 } from 'gsap/TweenMax'
import PolyBool from 'polybooljs';
import VizDetailInteract from '../components/VizDetailInteract.vue';
import EventBus from '../eventbus.js';
import { durations, mkgGold } from '../variables.js'
import { getBBoxScaleFactor } from '../utils.js'

export default {
  name: 'viz-detail',
  computed: mapState(['PIXIApp', 'canvas', 'viewport']),
  components: { VizDetailInteract },
  props: {
    object: {
      //in case we get no object prop passed down, try to fetch it from the store
      default: function () {
        if (this.$route.params.id) {
          return this.$store.getters.object(this.$route.params.id)
        } else {
          console.error('initialized VizDetail without id')
        }
      }
    }
  },
  watch: {
    canvas(newval) {
      this.resize(newval);
    }
  },
  data: function() {
    return {
      detailContainer: null,
      sprite: null
    }
  },
  methods: {
    resize(canvas) {
      
      //center container on canvas
      if(this.detailContainer) {
        this.detailContainer.position.set(canvas.width/2, canvas.height/2)
      }

      const frameBBox = this.object.tags.find(tag => tag.title === "Frame").geometry[0];
  
      //zoom to fit and center
      EventBus.$emit('zoomToBBox', canvas);

      //apply scaling to stay within viewport dimensions
      const scaleFactor = getBBoxScaleFactor(this.canvas, frameBBox);
      this.detailContainer.scale.set(scaleFactor);
      //this.sprite.width = frameBBox.width * scaleFactor;
      //this.sprite.height = frameBBox.height * scaleFactor;
    },
  },
  beforeMount: function() {
    console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
    const sprite = this.sprite = new PIXI.Sprite()
    sprite.anchor.set(0.5);
    detailContainer.addChild(sprite);

    //load texture
    if(!PIXI.utils.TextureCache[this.object.id]) {
      const loader = new PIXI.Loader();
      loader
        .add(this.object.id, `${process.env.VUE_APP_URL_DETAIL}/${this.object.id}/${this.object.id}-Frame.jpg`)
        .load((loader, resources) => {
          sprite.texture = PIXI.utils.TextureCache[this.object.id];
          
          if(!this.$store.state.skipFadeIn) {
            detailContainer.alpha = 0;
            TweenLite.to(detailContainer, durations.detailFadeIn, {alpha: 1, ease: Power2.easeInOut})
          }
        });
    } else {
      sprite.texture = PIXI.utils.TextureCache[this.object.id];
    }

    this.resize(this.canvas);
  },
  mounted: function () {

    this.viewport.addChild(this.detailContainer) 

    //if we came here with a spread transition that skips fade-in, enable fade-in again
    if(this.$store.state.skipFadeIn) {
      this.$nextTick(() => {
        this.$store.commit('skipFadeIn', false);
      });
    }

    //htmlviz
    this.$refs.detail.style.backgroundImage = `url(${process.env.VUE_APP_URL_IMG}/${this.object.id}/${this.object.id}.jpg)`;
  },
  beforeDestroy: function () {
    this.viewport.removeChild(this.detailContainer)
  }
}
</script>

<style scoped lang="scss">
</style>