<template>
  <div>
    <h4>Detail Interact {{ object.id }}</h4>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import { TweenLite, TimelineLite, Power2 } from "gsap/TweenMax";
import { mkgGold } from "../variables.js";
import { polygon } from "polygon-tools";

export default {
  name: "viz-detail",
  computed: {
    tooltip: function() {
      return this.$store.state.tooltip;
    },
    frame: function() {
      return this.$store.getters.detailFrameBBox(this.object.id);
    }
  },
  props: {
    object: {
      //in case we get no object prop passed down, try to fetch it from the store
      default: function() {
        if (this.$route.params.id) {
          return this.$store.getters.object(this.$route.params.id);
        } else {
          console.error("initialized VizDetail without id");
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
      masks: {} //key tagTitle, content: PIXI.Graphics

      //tag clickpolys are interactive polygons per tag (merged into a polygon)
      //clickpolys: {} //key tagTitle, content: PIXI.Graphics
    };
  },
  methods: {
    flashHighlights() {
      if (this.$store.state.isTouchDevice) {
        for (let tag in this.highlights) {
          new TimelineLite()
            .from(this.highlights[tag], 0, { alpha: 0 })
            .to(this.highlights[tag], 1, { alpha: 1 })
            .to(this.highlights[tag], 1, { alpha: 0 });
        }
      } else {
        for (let tag in this.highlights) {
          new TimelineLite()
            .from(this.highlights[tag], 0, { alpha: 0 })
            .to(this.highlights[tag], 0.25, { alpha: 1 })
            .to(this.highlights[tag], 0.25, { alpha: 0 })
            .to(this.highlights[tag], 0.25, { alpha: 1 })
            .to(this.highlights[tag], 0.25, { alpha: 0 });
        }
      }
    },

    getHoverGeometry(tagTitle, mouseX, mouseY) {
      // console.log("getHoverGeometry", tagTitle);

      const tagGeometries = this.geometries.find(
        tagGeo => tagGeo.tagTitle === tagTitle
      );
      for (let i = 0; i < tagGeometries.geometry.length; i++) {
        const geo = tagGeometries.geometry[i];
        if (
          mouseX >= geo.x &&
          mouseX <= geo.x + geo.size &&
          mouseY >= geo.y &&
          mouseY <= geo.y + geo.size
        ) {
          return geo;
        }
      }
      console.error("no geometry found for", ...arguments);
    },

    collectGeometry() {
      const allGeometries = [];
      this.object.tags.forEach(tag => {
        if (tag.title === "Frame") return;

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
        for (let i = 0; i < a.geometry.length; i++) aSize += a.geometry[i].size;
        for (let i = 0; i < b.geometry.length; i++) bSize += b.geometry[i].size;

        if (aSize === bSize) return 0;
        return aSize < bSize ? 1 : -1;
      });

      this.geometries = allGeometries;
    },

    createPolygons() {
      const allPolygons = [];
      // console.log(this.geometries)
      this.geometries.forEach(tagGeo => {
        const tagPolygons = tagGeo.geometry.map(geo => [
          [geo.x, geo.y],
          [geo.x + geo.size, geo.y],
          [geo.x + geo.size, geo.y + geo.size],
          [geo.x, geo.y + geo.size]
        ]);

        // const polies = tagPolygons.map(d => d.regions[0]);
        // console.log("polise", polies);
        let union = polygon.union(...tagPolygons);
        let flat = union.map(u => u.flat());
        // console.log(union, flat);

        allPolygons.push({
          tagTitle: tagGeo.tagTitle,
          geometry: flat
        });
      });
      // console.log("allPolygons");
      // console.log(JSON.stringify(allPolygons));
      this.polygons = allPolygons;
    },

    buildBackground() {
      const rect = (this.background = new PIXI.Graphics());
      rect.alpha = 0;
      rect.beginFill(0x0000ff);
      rect.drawRect(0, 0, this.frame.width, this.frame.height);
      rect.endFill();
      this.interactContainer.addChild(rect);

      //add interactivity
      rect.interactive = true;
      rect.buttonMode = true;
      rect.on("pointertap", () => {
        if (this.$store.state.isDragging) return;
        console.log("detail background tap!");
        this.$store.commit("unsetTooltip");
        Object.values(this.masks).forEach(m => (m.alpha = 0));
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
          rect.beginFill(0xffffff, 0);
          rect.lineStyle(12, mkgGold);
          rect.drawRect(geo.x, geo.y, geo.size, geo.size);
          rect.endFill();

          highlightContainer.addChild(rect);
        });

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
        for (let i = 0; i < tagPoly.geometry.length; i++) {
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
        // console.log("buildClickpolys", tagPoly);
        const clickPoly = new PIXI.Graphics();
        clickPoly.beginFill(0xff0000);
        clickPoly.alpha = 0;
        for (let i = 0; i < tagPoly.geometry.length; i++) {
          clickPoly.drawPolygon(tagPoly.geometry[i]);
        }
        clickPoly.endFill();

        //add interactivity
        clickPoly.interactive = true;
        clickPoly.buttonMode = true;

        const clickEvent = () => {
          console.log(
            "detail cutout tap!",
            tagPoly.tagTitle,
            "dragging",
            this.$store.state.isDragging
          );
          if (this.$store.state.isDragging) return;

          // end interactivity and unset tooltip
          clickPoly.interactive = false;
          clickPoly.buttonMode = false;
          this.$store.commit("unsetTooltip");

          //start the transition
          //this.$router.push({ path: `/viz/tag/${tagPoly.tagTitle}` });
          this.$store.dispatch("beginVizTransition", {
            from: "viz-detail",
            to: "viz-tag",
            targetId: tagPoly.tagTitle,
            targetPath: `/viz/tag/${tagPoly.tagTitle}`
          });
        };

        const pointerover = e => {
          // console.log(this.masks[tagPoly.tagTitle]);
          TweenLite.to(this.masks[tagPoly.tagTitle], 0.2, { alpha: 0.66 });

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
          const hoverGeometry = this.getHoverGeometry(
            tagPoly.tagTitle,
            localPosition.x,
            localPosition.y
          );

          const hoverCoordinates = {
            /* we need to subtract 1/2 of the detailContainer's width & height (because sprite.anchor at 0.5) */
            x: hoverGeometry.x - this.$parent.detailContainer.width / 2,
            y:
              hoverGeometry.y -
              this.$parent.detailContainer.height / 2 +
              hoverGeometry.size
          };

          this.$store.commit("setTooltip", {
            worldCoordinates: {
              x: hoverCoordinates.x,
              y: hoverCoordinates.y
            },
            content: {
              id: tagPoly.tagTitle,
              text: tagPoly.tagTitle,
              count: null
            }
          });
        };

        const pointerout = () => {
          TweenLite.to(this.masks[tagPoly.tagTitle], 0.2, {
            alpha: 0,
            ease: Power2.easeIn
          });

          /*for(let key in this.highlights) {
            TweenLite.to(this.highlights[key], 0.2, {alpha: 0, ease: Power2.easeIn});
          }*/

          // only unset if another tooltip event hasn't already fired
          if (tagPoly.tagTitle === this.tooltip.content.id) {
            this.$store.commit("unsetTooltip");
          }
        };

        clickPoly.on("touchstart", e => {
          if (
            this.$store.state.tooltip.isVisible &&
            this.$store.state.lastTouchedId === tagPoly.tagTitle
          ) {
            clickEvent();
          } else {
            this.$store.state.lastTouchedId = tagPoly.tagTitle;
            Object.values(this.masks).forEach(m => (m.alpha = 0));
            pointerover(e);
          }
        });

        clickPoly.on("touchmove", () => {
          if (this.$store.state.isDragging) {
            this.masks[tagPoly.tagTitle].alpha = 0;
            this.$store.commit("unsetTooltip");
          }
        });
        //clickPoly.on("touchend", pointerout);
        //clickPoly.on("touchendoutside", pointerout);

        clickPoly.on("click", clickEvent);
        clickPoly.on("mouseover", pointerover);
        clickPoly.on("mouseout", pointerout);

        this.interactContainer.addChild(clickPoly);
      });
    }
  },

  beforeMount: function() {
    console.log("hello this is a detail interaction layer");

    this.interactContainer = new PIXI.Container();
    this.interactContainer.position.set(
      -(this.frame.width / 2),
      -(this.frame.height / 2)
    );
    console.time("collectGeometry");
    this.collectGeometry();
    console.timeEnd("collectGeometry");

    console.time("createPolygons");
    this.createPolygons();
    console.timeEnd("createPolygons");

    console.time("buildBackground");
    this.buildBackground();
    console.timeEnd("buildBackground");

    console.time("buildMasks");
    this.buildMasks();
    console.timeEnd("buildMasks");

    console.time("buildHighlights");
    this.buildHighlights();
    console.timeEnd("buildHighlights");

    console.time("buildClickpolys");
    this.buildClickpolys();
    console.timeEnd("buildClickpolys");
  },
  mounted: function() {
    this.$parent.detailContainer.addChild(this.interactContainer);

    if (this.$store.state.isTouchDevice) {
      this.mobileInterval = setInterval(() => {
        this.flashHighlights();
      }, 10000);
    }
  },
  beforeDestroy: function() {
    this.$parent.detailContainer.removeChild(this.interactContainer);
    clearInterval(this.mobileInterval);
  },
  destroyed: function() {
    this.interactContainer.destroy(true);
  }
};
</script>

<style scoped lang="scss"></style>
