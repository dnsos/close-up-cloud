<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite } from 'gsap/TweenMax'
import PolyBool from 'polybooljs';

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
      lastHoveredTag: '',
      hideCutoutTimeout: null
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

        let cutoutCounter = 0;

        //add interactive cutouts
        this.object.tags.forEach(tag => {

          const tagMask = new PIXI.Graphics();
          const tagCutouts = new PIXI.Graphics();
          tagCutouts.alpha = 0;
          tagMask.alpha = 0;
          
          const polyRegions = [];

          tag.geometry.forEach(geo => {                

            //scale down coordinates
            const x = (geo.x - frame.x) * textureScale, 
                  y = (geo.y - frame.y) * textureScale, 
                  w = geo.size * textureScale,
                  h = geo.size * textureScale;

            polyRegions.push({
              regions: [
                  [
                      [x, y],
                      [x+w, y],
                      [x+w, y+h],
                      [x, y+h]
                  ]
              ],
              inverted: false
            })

            cutoutCounter++;
          })

          //combine all regions via PolyBool
          let result = polyRegions[0];
          for (let i=1; i < polyRegions.length; i++) {
            result = PolyBool.union(result, polyRegions[i]);
          }

          tagCutouts.beginFill(0xFF0000);
          tagMask.beginFill(0xFFFFFF, 0.55);
          
          tagMask.drawRect(0, 0, frame.width * textureScale, frame.height * textureScale);
          tagMask.beginHole();

          //convert PolyBool regions to PIXI Polygons
          for(let i=0; i<result.regions.length; i++) {

            const region = result.regions[i];

            const pixiPoly = [];
            for(let k=0; k<region.length; k++) {
              pixiPoly.push(...region[k])
            }

            tagMask.drawPolygon(pixiPoly);
            tagCutouts.drawPolygon(pixiPoly);
          }
        
          tagMask.endHole();
          tagMask.endFill();

          tagCutouts.interactive = true;
          tagCutouts.buttonMode = true;
          tagCutouts.on('pointertap', () => {
              if(this.$store.state.isDragging) return;
              console.log('detail cutout tap!', tag, `viz/tag/${tag.title}`);
              this.$router.push({ path: `/viz/tag/${tag.title}` });
            })
          tagCutouts.on('pointerout', () => {
            TweenLite.to(tagMask, 0.2, {alpha: 0});
          })
          tagCutouts.on('pointerover', () => {
            TweenLite.to(tagMask, 0.2, {alpha: 1});
          })

          detailContainer.addChild(tagMask);
          detailContainer.addChild(tagCutouts);
        })

        console.log('Total Cutouts in ', this.object.id, ':', cutoutCounter)

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