<template>
  <div class="renderer__wrapper" ref="rendererWrapper">
    <div v-if="isLoadingImages" class="loading-message">Bilder werden geladen ...</div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { TimelineMax, TweenMax } from 'gsap/TweenMax'
import PixiPlugin from 'gsap/PixiPlugin'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { createCloseupBox } from '../js/appendCloseups'
import { hideUnselectedTags } from '../js/hideUnselectedTags'
import { spreadSelectedTag } from '../js/spreadSelectedTag'
import { appendObject } from '../js/appendObject'
import { durations } from '../js/variables'
import { sanitizeLabel, getOccurrenceUID } from '../js/utils.js'

PixiPlugin.registerPIXI(PIXI)

export default {
  name: 'pixi-renderer',
  PIXIApp: null,
  cloudContainer: null,
  objectContainer: null,
  data: function () {
    return {
      isLoadingImages: true
    }
  },
  computed: {
    ...mapState(['activeView', 'canvas', 'clouds', 'taglist', 'selection', 'inverted']),
    hoveredTag: function () {
      return this.$store.state.selection.tag.hovered
    }
  },
  methods: {
    handleResize() {
      const { clientWidth: width, clientHeight: height } = this.$refs.rendererWrapper;
      this.PIXIApp.renderer.resize(width, height);
      this.$store.dispatch('updateCanvasSize', {width, height});

      //instantly set initial center
      if(this.cloudContainer.x === 0) {
        this.cloudContainer.x = width/2;
        this.cloudContainer.y = height/2;
        return;
      }

      new TimelineMax()
        .add( TweenMax.to(this.cloudContainer, 0.5, {x: width/2, y: height/2}) )
        .play()
    }
  },
  watch: {
    inverted: function (newValue, previousValue) {

      // timeline that inverts all PIXI related objects; TODO: make backgroundColor work
      let tl = new TimelineMax()
      if (newValue === true) {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 1 } }) )
        //tl.add( TweenMax.to(this.PIXIApp.renderer, durations.invert, { pixi: { backgroundColor: 0x292929 } }) )
      } else {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 0 } }) )
        //tl.add( TweenMax.to(this.PIXIApp.renderer, durations.invert, { pixi: { backgroundColor: 0xffffff } }) )
      }
      tl.play()

    },
    activeView: function (newView, previousView) {

      // from Cloud to Tag view
      if (newView === 'tag' && previousView === 'cloud') {
        const tagContainer = this.cloudContainer.children.find(child => child.name === this.selection.tag.active)
        const unselectedTags = this.cloudContainer.children.filter(child => child.name != this.selection.tag.active)
        hideUnselectedTags(unselectedTags)
        spreadSelectedTag(tagContainer)
      }
      
      // from Tag to Object view
      else if (newView === 'object' && previousView === 'tag') {
        this.cloudContainer.visible = false
        this.objectContainer.addChild(appendObject(this.selection.object.active, this.PIXIApp))
      }

    }
  },
  mounted: function () {

    //console.clear();
    this.PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: false,
      backgroundColor: 0xffffff,
      resolution: 1
    })

    const wrap = this.$refs.rendererWrapper;
    const PIXIApp = this.PIXIApp;

    // init negative filter (tween between alpha values)
    let colorMatrix = new PIXI.filters.ColorMatrixFilter()
    colorMatrix.negative()
    colorMatrix.alpha = 0
    PIXIApp.stage.filters = [colorMatrix]
    
    // append PIXI.Application to wrapper
    wrap.appendChild(PIXIApp.view)

    // create root containers for cloud and object view
    this.cloudContainer = new PIXI.Container()
    this.cloudContainer.name = 'cloudContainer'
    this.cloudContainer.x = this.canvas.width/2;
    this.cloudContainer.y = this.canvas.height/2;

    this.objectContainer = new PIXI.Container()
    this.objectContainer.name = 'objectContainer'
    PIXIApp.stage.addChild(this.cloudContainer, this.objectContainer)

    //handle resize
    PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    
    if(!this.$store.state.clouds.overview) {
      this.$store.dispatch('computeForceLayout', {
        key: 'overview',
        data: this.taglist
      });
    }

    //@todo make loading more general, load more on demand
    const loader = new PIXI.Loader();
    const labelBoxes = {};

    for (const tag of this.taglist) { 

      const labelSant = sanitizeLabel(tag.title);

      //store labelBoxes to update images upon loaded
      labelBoxes[labelSant] = createCloseupBox(tag.title)
      this.cloudContainer.addChild(labelBoxes[labelSant]) 

      const uid = getOccurrenceUID(tag.title, tag.occurrences[0])
      const thumbName = `${uid}.jpg`;
      const filename = tag.occurrences[0].origin;
      loader.add(uid, `assets/images/thumb/${filename}/${thumbName}`);
    }

    loader.load((loader, resources) => {

      this.isLoadingImages = false
      //const tex = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/bunny.png');

      for(let key in resources) {

        const res = resources[key];
        const labelSant = key.split('-')[1];
        const tagContainer = labelBoxes[labelSant] ? labelBoxes[labelSant] : null;

        if(res.error) {
          console.error(res.error, res.url);
          if(tagContainer) {
            tagContainer.tint = 0xff0000;
            tagContainer.alpha = 0.5;
          }
          continue;
        }

        if(!tagContainer) {
          console.error('No PIXI Container found for Tag ', key)
          return;
        }

        //apply the texture to the last tag sprite (uppermost)
        const occurrences = tagContainer.children.find(child => child.name === 'occurrencesContainer')
        const last = occurrences.children.length-1;
        occurrences.children[last].texture = resources[key].texture;
        occurrences.children[last].tint = 0xffffff;
      }
    });
  }
}
</script>

<style scoped lang="scss">
.renderer__wrapper {
  width: 100%;
  height: 100%;
}

.loading-message {
  position: absolute;
  padding: calc(var(--grid-spacing)/4);
  top: 50%;
  left: 50%;
  background-color: rgba(0,0,0,0.1)
}
</style>