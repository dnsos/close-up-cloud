<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
    <VizDetailInteract :object="object" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, Power2 } from 'gsap/TweenMax'
import VizDetailInteract from '../components/VizDetailInteract.vue';
import EventBus from '../eventbus.js';
import { durations } from '../variables.js'

export default {
  name: 'viz-detail',
  computed: {
    ...mapState(['PIXIApp', 'canvas', 'vizContainer', 'vizTransition']),
    frameBBox() {
      return this.object.tags.find(tag => tag.title === "Frame").geometry[0];
    },
  },
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
  data: function() {
    return {
      detailContainer: null,
      sprite: null
    }
  },
  beforeMount: function() {
    //console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
    const sprite = this.sprite = new PIXI.Sprite()
    sprite.anchor.set(0.5);
    detailContainer.addChild(sprite);

    //load texture
    if(!PIXI.utils.TextureCache[this.object.id]) {
      const loader = new PIXI.Loader();
      loader
        .add(this.object.id, `${process.env.VUE_APP_URL_DETAIL}/${this.object.id}.jpg`)
        .load(() => {
          sprite.texture = PIXI.utils.TextureCache[this.object.id];
          
          if(!this.$store.state.isTransitioning) {
            detailContainer.alpha = 0;
            TweenLite.to(detailContainer, durations.detailFadeIn, {alpha: 1, ease: Power2.easeInOut})
          }
        });
    } else {
      sprite.texture = PIXI.utils.TextureCache[this.object.id];
    }
  },
  mounted: function () {
    
    document.title = `${this.object.title} – Close-Up Cloud`;

    this.vizContainer.addChild(this.detailContainer) 

    //if we came here with a spread transition, end it
    //@todo vizTransition should do this
    if(this.$store.state.isTransitioning) {
      this.$nextTick(() => {
        this.$store.dispatch('endVizTransition');
      });
    //if this is a fresh page load, zoom to fit (vizTransition takes care of that otherwise)
    } else {
      this.$store.dispatch('computeWorldSize', this.frameBBox);
      EventBus.$emit('zoomToWorld');
      EventBus.$emit('moveToCenter');
    }

    EventBus.$on('fadeOutDetail', () => {
      TweenLite.to(this.detailContainer, durations.detailFadeOut, { alpha: 0 }, Power2.easeOut);
    });
    

    //htmlviz
    //this.$refs.detail.style.backgroundImage = `url(${process.env.VUE_APP_URL_IMG}/${this.object.id}/${this.object.id}.jpg)`;
  },
  beforeDestroy: function () {
    document.title = `Close-Up Cloud`;
    this.vizContainer.removeChild(this.detailContainer)
  },
  destroyed: function() {
    this.detailContainer.destroy(true);
  }
}
</script>

<style scoped lang="scss">
</style>