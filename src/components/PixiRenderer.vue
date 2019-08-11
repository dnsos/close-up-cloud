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
import { sanitizeLabel } from '../js/utils.js'

PixiPlugin.registerPIXI(PIXI)

export default {
  name: 'pixi-renderer',
  data: function () {
    return {
      isLoadingImages: true
    }
  },
  computed: {
    ...mapState(['activeView', 'clouds', 'selection', 'inverted']),
    ...mapGetters(['taglist']),
    hoveredTag: function () {
      return this.$store.state.selection.tag.hovered
    }
  },
  /*methods: {
  },*/
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

      // references to main containers
      const cloudContainer = this.PIXIApp.stage.children.find(child => child.name === 'cloudContainer')
      const objectContainer = this.PIXIApp.stage.children.find(child => child.name === 'objectContainer')

      // from Cloud to Tag view
      if (newView === 'tag' && previousView === 'cloud') {
        const selectedTag = cloudContainer.children.find(child => child.name === this.selection.tag.active)
        const unselectedTags = cloudContainer.children.filter(child => child.name != this.selection.tag.active)
        hideUnselectedTags(unselectedTags)
        spreadSelectedTag(selectedTag, this.PIXIApp)
      }
      
      // from Tag to Object view
      else if (newView === 'object' && previousView === 'tag') {
        cloudContainer.visible = false
        objectContainer.addChild(appendObject(this.selection.object.active, this.PIXIApp))
      }

    }
  },
  mounted: function () {

    //console.clear();

    const wrap = this.$refs.rendererWrapper;

    const PIXIApp = new PIXI.Application({
      width: 1280,
      height: 800,
      antialias: true,
      transparent: false,
      backgroundColor: 0xffffff,
      resolution: 1
    })
    this.PIXIApp = PIXIApp;

    //handle resize
    PIXIApp.renderer.autoResize = true;
    window.addEventListener('resize', handleResize);
    const handleResize = function() {
      PIXIApp.renderer.resize(wrap.clientWidth, wrap.clientHeight);
      this.$store.dispatch('updateCanvasSize', {
        width: wrap.clientWidth, 
        height: wrap.clientHeight
      })
    }.bind(this);
    handleResize(); //set initial canvas size

    // init negative filter (tween between alpha values)
    let colorMatrix = new PIXI.filters.ColorMatrixFilter()
    colorMatrix.negative()
    colorMatrix.alpha = 0
    PIXIApp.stage.filters = [colorMatrix]
    
    // append PIXI.Application to wrapper
    wrap.appendChild(PIXIApp.view)

    // create root containers for cloud/tag views and object view
    const cloudContainer = new PIXI.Container()
    const objectContainer = new PIXI.Container()
    cloudContainer.name = 'cloudContainer'
    objectContainer.name = 'objectContainer'

    PIXIApp.stage.addChild(cloudContainer, objectContainer)
    
    if(!this.$store.state.clouds.overview) {
      this.$store.dispatch('computeForceLayout', {
        key: 'overview',
        data: this.taglist
      });
    }

    const loader = new PIXI.Loader();
    const labelBoxes = {};

    for (const tag of this.taglist) { 

      const labelSant = sanitizeLabel(tag.title);

      //store labelBoxes to update images upon loaded
      labelBoxes[labelSant] = createCloseupBox(tag.title)
      cloudContainer.addChild(labelBoxes[labelSant]) 
      
      //add every first tag image to loader
      const firstOcc = tag.occurrences[0];
      const filename = firstOcc.origin;
      const top = firstOcc.geometry[0].y;
      const left = firstOcc.geometry[0].x;
      const uid = `${filename}-${labelSant}-${top}-${left}`;
      const thumbName = `${uid}.jpg`;
      loader.add(uid, `assets/images/thumb/${filename}/${thumbName}`);
    }

    loader.load((loader, resources) => {

      this.isLoadingImages = false
      //const tex = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/bunny.png');

      for(let key in resources) {

        const res = resources[key];
        const labelSant = key.split('-')[1];
        const placeholder = labelBoxes[labelSant] ? labelBoxes[labelSant].children[0] : null;

        if(res.error) {
          console.error(res.error, res.url);
          if(placeholder) {
            placeholder.tint = 0xff0000;
            placeholder.alpha = 0.5;
          }
          continue;
        } 

        if(placeholder) {
          placeholder.texture = resources[key].texture;
        } else {
          console.warn('No PIXI Container found for Tag ', key)
        }
      }
    });

    /*var ticker = new PIXI.Ticker();
    ticker.add(() => {
      console.log('HI');
        //renderer.render(stage);
    }, PIXI.UPDATE_PRIORITY.LOW);
    ticker.start();*/
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