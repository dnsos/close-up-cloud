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
import { hideUnselectedTags } from '../js/hideUnselectedTags'
import { spreadSelectedTag } from '../js/spreadSelectedTag'
import { createCloseupBox } from '../js/createCloseupBox'
import { createDetail } from '../js/createDetail'
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

      // timeline that inverts all PIXI related objects
      let tl = new TimelineMax()
      if (newValue === true) {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 1 }, ease: Power1.easeInOut }) )
      } else {
        tl.add( TweenMax.to(this.PIXIApp.stage.filters[0], durations.invert, { pixi: { alpha: 0 }, ease: Power1.easeInOut }) )
      }
      tl.play()

    },
    activeView: function (newView, previousView) {

      //@todo router stuff
      // from Cloud to Tag view
      if (newView === 'tag' && previousView === 'cloud') {
        const tagContainer = this.cloudContainer.children.find(child => child.name === this.selection.tag.active.title)
        const unselectedTags = this.cloudContainer.children.filter(child => child.name != this.selection.tag.active.title)
        hideUnselectedTags(unselectedTags)
        spreadSelectedTag(tagContainer)
      }
      
      // from Tag to Object view
      else if (newView === 'object' && previousView === 'tag') {
        this.cloudContainer.visible = false
        this.objectContainer.addChild(createDetail(this.selection.object.active))
      }

    }
  },
  mounted: function () {

    console.clear();
    const PIXIApp = this.PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: true,
      resolution: 1
    })

    const wrap = this.$refs.rendererWrapper;

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
    
    //create cloud overview force layout
    if(!this.$store.state.clouds.overview) {
      
      const forceInput = this.taglist.map(tag => {
        return { 
          id: tag.title, 
          weight: tag.tagCount 
        };
      });

      this.$store.dispatch('computeForceLayout', {
        key: 'overview',
        data: forceInput
      });
    }

    //@todo exclude, make loading more general, load more on demand
    const loader = new PIXI.Loader();
    
    //store tagContainer to update images upon loaded
    const tagContainer = {};

    for (const tag of this.taglist) { 

      const labelSant = sanitizeLabel(tag.title);

      tagContainer[labelSant] = createCloseupBox(tag.title)
      this.cloudContainer.addChild(tagContainer[labelSant]) 

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
        const container = tagContainer[labelSant] ? tagContainer[labelSant] : null;

        if(res.error) {
          console.error(res.error, res.url);
          if(container) {
            container.tint = 0xff0000;
            container.alpha = 0.5;
          }
          continue;
        }

        if(!container) {
          console.error('No PIXI Container found for Tag ', key)
          return;
        }

        //apply the texture to the last tag sprite (uppermost)
        const occurrences = container.children.find(child => child.name === 'occurrencesContainer')
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
  background-color: var(--color-primary-0);
  transition: background-color 2s ease-in-out;
}

.loading-message {
  position: absolute;
  padding: calc(var(--grid-spacing)/4);
  top: 50%;
  left: 50%;
  background-color: rgba(0,0,0,0.1)
}
</style>