<template>
  <div>
    <h4>Detail Interact {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TweenLite, TimelineLite, Power2 } from 'gsap/TweenMax'
import PolyBool from 'polybooljs';
import { mkgGold } from '../variables.js'

export default {
  name: 'viz-detail',
  computed: {
    tooltip: function() {
      return this.$store.state.tooltip
    },
    frame: function() {
      return this.$store.getters.detailFrameBBox(this.object.id);
    }
  },
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

      interactContainer: null,

      //full-size rectangle for flashing highlights on tap
      background: null,

      //geometries: array of single close-up geometries per tag
      geometries: [], //content: {tagTitle: 'abc', geometry: [{x, y, size}]}

      //polygons are combined geometry rectangles into polygons per tag
      polygons: [], //content: {tagTitle: 'abc', geometry: [PIXI polygon coordinates]}

      //tag highlights are containers of label outlines (individual PIXI rectangles)
      highlights: {}, //key tagTitle, content: PIXI.Container
      
      //tag masks are the semi-transparent overlays (merged into a polygon)
      masks: {}, //key tagTitle, content: PIXI.Graphics      

      //tag clickpolys are interactive polygons per tag (merged into a polygon)
      //clickpolys: {} //key tagTitle, content: PIXI.Graphics
    }
  },
  methods: {

    flashHighlights() {
      for(let tag in this.highlights) {
        new TimelineLite()
          .from(this.highlights[tag], 0, {alpha: 0})
          .to(this.highlights[tag], 0.25, {alpha: 1})
          .to(this.highlights[tag], 0.25, {alpha: 0})
          .to(this.highlights[tag], 0.25, {alpha: 1})
          .to(this.highlights[tag], 0.25, {alpha: 0})
      }
    },

    getHoverGeometry(tagTitle, mouseX, mouseY) {

      const tagGeometries = this.geometries.find(tagGeo => tagGeo.tagTitle === tagTitle);
      for(let i=0; i<tagGeometries.geometry.length; i++) {

        const geo = tagGeometries.geometry[i];
        if(mouseX >= geo.x && mouseX <= geo.x + geo.size &&
          mouseY >= geo.y && mouseY <= geo.y + geo.size) {
            return geo;
          }
      }
      console.error('no geometry found for', ... arguments);
    },

    collectGeometry() {

      const allGeometries = [];
      this.object.tags.forEach(tag => {
        if(tag.title === 'Frame') return;
        
        const tagGeometries = {
          tagTitle: tag.title,
          geometry: []
        };

        //store geometry for every rectangle
        tag.geometry.forEach(geo => {
          tagGeometries.geometry.push({ 
            x: geo.x - this.frame.x, 
            y: geo.y - this.frame.y, 
            size: geo.size
          });
        });
        allGeometries.push(tagGeometries);
      });

      //sort geometries so that largest areas are first
      allGeometries.sort((a, b) => {
        let aSize = 0;
        let bSize = 0;
        for(let i=0; i<a.geometry.length; i++) aSize += a.geometry[i].size;
        for(let i=0; i<b.geometry.length; i++) bSize += b.geometry[i].size;

        if(aSize === bSize) return 0;
        return (aSize < bSize) ? 1 : -1;
      });

      this.geometries = allGeometries;
    },

    createPolygons() {

      const allPolygons = [];
      this.geometries.forEach((tagGeo) => {
        
        const tagPolygons = [];
        tagGeo.geometry.forEach(geo => {
          tagPolygons.push({
            regions: [
                [
                    [geo.x, geo.y],
                    [geo.x+geo.size, geo.y],
                    [geo.x+geo.size, geo.y+geo.size],
                    [geo.x, geo.y+geo.size]
                ]
            ],
            inverted: false
          })          
        }) //end each geometry

        //combine all tagPolygons via PolyBool
        let result = tagPolygons[0];
        for (let i=1; i < tagPolygons.length; i++) {
          result = PolyBool.union(result, tagPolygons[i]);
        }

        //convert PolyBool regions to PIXI Polygons
        const pixiRegions = [];
        for(let i=0; i<result.regions.length; i++) {
          const region = result.regions[i];
          const pixiRegion = [];
          for(let k=0; k<region.length; k++) {
            pixiRegion.push(...region[k])
          }
          pixiRegions.push(pixiRegion)
        }

        allPolygons.push({
          tagTitle: tagGeo.tagTitle,
          geometry: pixiRegions
        })

        this.polygons = allPolygons;
      })
    },


    buildBackground() {
      const rect = this.background = new PIXI.Graphics();
      rect.alpha = 0;
      rect.beginFill(0x0000FF);
      rect.drawRect(0, 0, this.frame.width, this.frame.height);
      rect.endFill();
      this.interactContainer.addChild(rect);
    
      //add interactivity
      rect.interactive = true;
      rect.buttonMode = true;
      rect.on('pointertap', () => {
        if(this.$store.state.isDragging) return;
        console.log('detail background tap!');
        this.flashHighlights();
      });
    },

    //outlines
    buildHighlights() {

      this.geometries.forEach(tagGeo => {
        
        const highlightContainer = new PIXI.Container(); 
        highlightContainer.alpha = 0;

        tagGeo.geometry.forEach(geo => {
          const rect = new PIXI.Graphics();
          rect.beginFill(0xFFFFFF, 0);
          rect.lineStyle(12, mkgGold);
          rect.drawRect(geo.x, geo.y, geo.size, geo.size);
          rect.endFill();
          
          highlightContainer.addChild(rect)
        })
        
        this.highlights[tagGeo.tagTitle] = highlightContainer;
        this.interactContainer.addChild(highlightContainer);
      });

    },


    buildMasks() {

      this.polygons.forEach(tagPoly => {

        const tagMask = new PIXI.Graphics();
        tagMask.alpha = 0;
        tagMask.beginFill(0x000000);
        tagMask.drawRect(0, 0, this.frame.width, this.frame.height);
        tagMask.beginHole();
        for(let i=0; i<tagPoly.geometry.length; i++) {
          tagMask.drawPolygon(tagPoly.geometry[i]);
        }
        tagMask.endHole();
        tagMask.endFill();
        
        this.masks[tagPoly.tagTitle] = tagMask;
        this.interactContainer.addChild(tagMask);
      });

    },

    buildClickpolys() {

      this.polygons.forEach(tagPoly => {

        const clickPoly = new PIXI.Graphics();
        clickPoly.beginFill(0xFF0000);
        clickPoly.alpha = 0;
        for(let i=0; i<tagPoly.geometry.length; i++) {
          clickPoly.drawPolygon(tagPoly.geometry[i]);
        }
        clickPoly.endFill();

        //add interactivity
        clickPoly.interactive = true;
        clickPoly.buttonMode = true;
        clickPoly.on('pointertap', () => {
          if(this.$store.state.isDragging) return;
          console.log('detail cutout tap!', tagPoly.tagTitle);

          // end interactivity and unset tooltip
          clickPoly.interactive = false
          clickPoly.buttonMode = false
          this.$store.commit('unsetTooltip')
          
          //start the transition
          //this.$router.push({ path: `/viz/tag/${tagPoly.tagTitle}` });
          this.$store.dispatch('beginVizTransition', { 
            from: 'viz-detail', 
            to: 'viz-tag', 
            targetId: tagPoly.tagTitle,
            targetPath: `/viz/tag/${tagPoly.tagTitle}`
          });
        })
        clickPoly.on('pointerover', (e) => {
          TweenLite.to(this.masks[tagPoly.tagTitle], 0.2, {alpha: 0.66});

          //show other cutouts
          /*for(let key in this.highlights) {
            if(key === tagPoly.tagTitle) {
            //  TweenLite.to(this.highlights[key], 0.2, {alpha: 1});
            } else {
              TweenLite.to(this.highlights[key], 0.2, {alpha: 0.25});
            }
          }*/

          // access coordinates of hovered geometry
          const localPosition = e.data.getLocalPosition(this.background);
          const hoverGeometry = this.getHoverGeometry(tagPoly.tagTitle, localPosition.x, localPosition.y);

          const hoverCoordinates = {
            /* we need to subtract 1/2 of the detailContainer's width & height (because sprite.anchor at 0.5) */
            x: hoverGeometry.x - (this.$parent.detailContainer.width/2),
            y: hoverGeometry.y - (this.$parent.detailContainer.height/2) + hoverGeometry.size
          }

          this.$store.commit('setTooltip', {
            worldCoordinates: {
              x: hoverCoordinates.x,
              y: hoverCoordinates.y
            },
            content: {
              id: tagPoly.tagTitle,
              text: tagPoly.tagTitle,
              count: null
            }
          })
        })
        clickPoly.on('pointerout', () => {
          TweenLite.to(this.masks[tagPoly.tagTitle], 0.2, {alpha: 0, ease: Power2.easeIn});
          
          /*for(let key in this.highlights) {
            TweenLite.to(this.highlights[key], 0.2, {alpha: 0, ease: Power2.easeIn});
          }*/

          // only unset if another tooltip event hasn't already fired
          if (tagPoly.tagTitle === this.tooltip.content.id) {
            this.$store.commit('unsetTooltip')
          }
        })
        
        this.interactContainer.addChild(clickPoly);
      });
    }
  },

  beforeMount: function() {
    //console.log("hello this is a detail interaction layer")

    this.interactContainer = new PIXI.Container();
    this.interactContainer.position.set(-(this.frame.width/2), -(this.frame.height/2))

    this.collectGeometry();
    this.createPolygons();
    
    this.buildBackground();
    this.buildMasks();
    this.buildHighlights();
    this.buildClickpolys();
  },
  mounted: function () {
    this.$parent.detailContainer.addChild(this.interactContainer) 
  },
  beforeDestroy: function () {
    this.$parent.detailContainer.removeChild(this.interactContainer) 
  },
  destroyed: function() {
    this.interactContainer.destroy(true);
  }
}
</script>

<style scoped lang="scss">
</style>