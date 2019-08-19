<template>
  <div class="detailobj" ref="detail">
  <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite } from 'gsap/TweenMax'

export default {
  name: 'viz-detail',
  computed: mapState(['PIXIApp', 'canvas', 'viewport']),
  props: {
    object: {
      //in case we get no object prop passed down, try to fetch it from the store
      default: function () {
        if (this.$route.params.id) {
          return this.$store.getters.object(this.$route.params.id)
        } else {
          console.warning('initialized VizDetail without id')
        }
      }
    }
  },
  watch: {
    canvas(newval) {
      
      //center detail image
      if(this.sprite) {
        this.sprite.position.set(newval.width/2, newval.height/2)
      }
    }
  },
  data: function() {
    return {
      detailContainer: null,
      sprite: null,
    }
  },
  beforeMount: function() {
    console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
    detailContainer.alpha = 0;

    const sprite = this.sprite = new PIXI.Sprite()

    //@todo add interactive cutouts
    /*this.object.tags.forEach(tag => {

      tag.geometry.forEach(geo => {
        const rect = new PIXI.Sprite(PIXI.Texture.WHITE);
        rect.position.set(geo.x, geo.y);
        rect.width = geo.size;
        rect.height = geo.size;

        rect.interactive = true;
        rect.buttonMode = true;
        rect.on('pointertap', () => {
          if(this.$store.state.isDragging) return;
            console.log('detail cutout tap!', this.item);
            this.$router.push({ path: `viz/tag/${this.tag.title}` })
        })

        detailContainer.addChild(rect);
      })
    })*/

    detailContainer.addChild(sprite);

    const loader = new PIXI.Loader()
    loader
      .add(this.object.id, `${process.env.VUE_APP_URL_IMG}/${this.object.id}/${this.object.id}.jpg`)
      .load((loader, resources) => {

        const texture = resources[this.object.id].texture
        const textureHeight = texture.baseTexture.height
        sprite.texture = texture;
        
        //@todo center container
        detailContainer.position.set(this.canvas.width/2, this.canvas.height/2)
        //detailContainer.anchor.set(0.5)

        const desiredHeight = this.canvas.height
        const ratio = (desiredHeight / textureHeight)
        this.viewport.setZoom(ratio, true)

        TweenLite.to(detailContainer, 1, {alpha: 1});
      });
  },
  mounted: function () {

    this.viewport.addChild(this.detailContainer) 

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