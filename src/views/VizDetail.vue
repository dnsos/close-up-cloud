<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, TimelineLite } from 'gsap/TweenMax'
import PolyBool from 'polybooljs';

export default {
  name: 'viz-detail',
  computed: mapState(['PIXIApp', 'canvas', 'viewport', 'renderer']),
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
      sprite: null,
      masks: []
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
      this.renderer.zoomToFitBBox(canvas);

      //apply scaling to stay within viewport dimensions
      const scaleFactor = this.renderer.getDetailScaleFactor(frameBBox);
      this.sprite.width = frameBBox.width * scaleFactor;
      this.sprite.height = frameBBox.height * scaleFactor;
    }
  },
  beforeMount: function() {
    console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
    //detailContainer.alpha = 0;

    const sprite = this.sprite = new PIXI.Sprite()
    sprite.anchor.set(0.5);
    detailContainer.addChild(sprite);

    const frame = this.object.tags.find(tag => tag.title === 'Frame').geometry[0];

    // add interactivity
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointertap', () => {
      if(this.$store.state.isDragging) return;
      console.log('detail tap!');

      for(let mask of this.masks) {
        new TimelineLite()
          .from(mask, 0, {alpha: 0})
          .to(mask, 0.2, {alpha: 0.66})
          .to(mask, 0.2, {alpha: 0})
          .to(mask, 0.2, {alpha: 0.66})
          .to(mask, 0.2, {alpha: 0})
      }
    });

    //load texture
    if(!PIXI.utils.TextureCache[this.object.id]) {
      const loader = new PIXI.Loader();
      loader
        .add(this.object.id, `${process.env.VUE_APP_URL_IMG}/${this.object.id}/${this.object.id}-Frame.jpg`)
        .load((loader, resources) => {
          sprite.texture = PIXI.utils.TextureCache[this.object.id];
        });
    } else {
      sprite.texture = PIXI.utils.TextureCache[this.object.id];
    }

    this.resize(this.canvas);
        
        /*const textureWidth = texture.baseTexture.width;
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

          tagCutouts.beginFill(0xFFFFFF, 0.1);
          tagCutouts.lineStyle(2, 0xFFFFFF);
          tagMask.beginFill(0xFFFFFF);
          
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
            TweenLite.to(tagMask, 0.2, {alpha: 0.55});
          })

          this.masks.push(tagCutouts);

          detailContainer.addChild(tagMask);
          detailContainer.addChild(tagCutouts);
        })

        console.log('Total Cutouts in ', this.object.id, ':', cutoutCounter)*/
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