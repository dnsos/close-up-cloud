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
      
      this.resize(newval);
    }
  },
  data: function() {
    return {
      detailContainer: null,
      sprite: null,
    }
  },
  methods: {
    resize(canvas) {

      if(!this.sprite || !this.sprite.texture) return;

      //center detail image
      const textureHeight = this.sprite.texture.baseTexture.height
      const textureWidth = this.sprite.texture.baseTexture.width        
      this.detailContainer.position.set(this.canvas.width/2 - textureWidth/2, this.canvas.height/2 - textureHeight/2)
        
      //@todo also pay respect to width
      const desiredHeight = this.canvas.height
      const ratio = (desiredHeight / textureHeight)
      this.viewport.setZoom(ratio, true)
    }
  },
  beforeMount: function() {
    console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
    detailContainer.alpha = 0;

    const sprite = this.sprite = new PIXI.Sprite()
    detailContainer.addChild(sprite);

    const frame = this.object.tags.find(tag => tag.title === 'Frame').geometry[0];

    const loader = new PIXI.Loader()
    loader
      .add(this.object.id, `${process.env.VUE_APP_URL_IMG}/${this.object.id}/${this.object.id}-Frame.jpg`)
      .load((loader, resources) => {

        const texture = resources[this.object.id].texture
        sprite.texture = texture;

        this.resize(this.canvas);        
        TweenLite.to(detailContainer, 1, {alpha: 1});
        
        const textureWidth = texture.baseTexture.width;
        const textureScale = textureWidth / frame.width;

        //add interactive cutouts
        this.object.tags.forEach(tag => {

          tag.geometry.forEach(geo => {
            const rect = new PIXI.Sprite(PIXI.Texture.WHITE);
                
            //right now we are working with scaled down textures (max 1280px width or height)
            //but all coordinates in the data are still full size, so lets scale them down
            rect.width = geo.size * textureScale;
            rect.height = geo.size * textureScale;
            rect.position.set(
              (geo.x - frame.x) * textureScale, 
              (geo.y - frame.y) * textureScale
            );
            
            //@debug tint
            rect.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
            rect.alpha = 0;

            rect.interactive = true;
            rect.buttonMode = true;
            rect.on('pointertap', () => {
              if(this.$store.state.isDragging) return;
              console.log('detail cutout tap!', tag, `viz/tag/${tag.title}`);
              this.$router.push({ path: `/viz/tag/${tag.title}` });
            })

            rect.on('pointerover', () => {
              //if(this.$store.state.isDragging) return
              //rect.zIndex = 1
              TweenLite.to(rect, 0.2, {alpha: 0.5});
            })
            rect.on('pointerout', () => {
              //if(this.$store.state.isDragging) return
              //rect.zIndex = 0
              TweenLite.to(rect, 0.2, {alpha: 0});
            })

            detailContainer.addChild(rect);
          })
        })

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