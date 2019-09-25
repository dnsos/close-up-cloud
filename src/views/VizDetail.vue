<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import { TweenLite, TimelineLite, Power2 } from 'gsap/TweenMax'
import PolyBool from 'polybooljs';
import { durations } from '../variables.js'

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
    },

    buildInteractiveCutouts() {
      
      const frame = this.object.tags.find(tag => tag.title === "Frame").geometry[0];
      const scaleFactor = this.renderer.getDetailScaleFactor(frame);
      let cutoutCounter = 0;

      //add interactive cutouts
      this.object.tags.forEach(tag => {

        const tagMask = new PIXI.Graphics();
        const tagCutouts = new PIXI.Graphics();
        tagMask.position.set(-(frame.width/2)*scaleFactor, -(frame.height/2)*scaleFactor)
        tagCutouts.position.set(-(frame.width/2)*scaleFactor, -(frame.height/2)*scaleFactor)
        tagCutouts.alpha = 0;
        tagMask.alpha = 0;
        
        const polyRegions = [];

        tag.geometry.forEach(geo => {                

          //scale down coordinates
          const x = (geo.x - frame.x) * scaleFactor, 
                y = (geo.y - frame.y) * scaleFactor, 
                w = geo.size * scaleFactor,
                h = geo.size * scaleFactor;

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
        
        tagMask.drawRect(0, 0, frame.width * scaleFactor, frame.height * scaleFactor);
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
            this.$store.commit('neutraliseTooltip')
            console.log('detail cutout tap!', tag, `viz/tag/${tag.title}`);
            this.$router.push({ path: `/viz/tag/${tag.title}` });
          })
        tagCutouts.on('pointerout', () => {
          this.$store.commit('neutraliseTooltip')
          TweenLite.to(tagMask, 0.2, {alpha: 0});
        })
        tagCutouts.on('pointerover', () => {
          this.$store.commit('setTooltip', {
            view: 'detail',
            content: {
              text: tag.title
            }
          })
          TweenLite.to(tagMask, 0.2, {alpha: 0.55});
        })

        this.masks.push(tagCutouts);

        this.detailContainer.addChild(tagMask);
        this.detailContainer.addChild(tagCutouts);
      })
      
      //console.log('cutoutCounter', cutoutCounter);

    }
  },
  beforeMount: function() {
    console.log("hello this is a detail view")

    const detailContainer = this.detailContainer = new PIXI.Container();
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

    this.buildInteractiveCutouts();

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