<template>
  <div>
    Viz Input Watcher
    <!-- {{ scale }} {{ hypo }} -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { throttled } from '../utils'

export default {
  name: 'viz-transition',
  data: function() {
    return {
      panStartPointer: { x: 0, y: 0 },
      panStartCam: { x: 0, y: 0 },
      throttledPan: null,
      hypo: null,
      scale: 0
    }
  },
  computed: {
  ...mapState(['vizContainer', 'canvas', 'camera', 'cameraZoom', 'cameraMinZoom', 'cursor', 'isDragging', 'isTransitioning']),
  },
  watch: {
  },
  methods: {
    handleScroll(e) {
      if(this.isTransitioning) return;
      e.preventDefault();

      if(e.deltaY === 0) return;
      let deltaZoom;
      
      //this is targeted at touchpads and magic mouses, 
      //where deltaY is around 1-6 and wheel event is called very often
      if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        deltaZoom = Math.abs(e.deltaY)/500;
      //deltaY values on windows range from 3 to 100 depending on the browser
      //so let's not use deltaY but a value depending on current zoom
      } else {
        deltaZoom = this.cameraZoom.zoom/8;
      }

      let desiredZoom = this.cameraZoom.zoom;
      if( e.deltaY > 0 ) {
        //zoom out
        desiredZoom -= deltaZoom;
        desiredZoom = Math.max(desiredZoom, this.cameraMinZoom);
      } else {
        //zoom in
        desiredZoom += deltaZoom;
        desiredZoom = Math.min(desiredZoom, 1);
      }

      this.$store.commit('setCameraZoom', {
        zoom: desiredZoom,
        center: this.cursor
      });
    },
    
    handleCursorMove(e) {
      this.$store.commit('cursor', {
        x: e.clientX,
        y: e.clientY
      });
    },

    handlePanStart(e) {
      if(this.isTransitioning) return;

      this.panStartPointer = { 
        x: e.clientX,
        y: e.clientY
      };
      this.panStartCam = { ...this.camera };
      document.body.addEventListener('mousemove', this.tHandlePanMove);
    },
    handlePanEnd() {
      this.$store.commit('dragEnd');
      document.body.removeEventListener('mousemove', this.tHandlePanMove);
    },
    handlePanMove(e) {
      if(this.isTransitioning) return;
      
      if(this.isDragging) {
        const offset = {
          x: this.panStartCam.x + e.clientX - this.panStartPointer.x,
          y: this.panStartCam.y + e.clientY - this.panStartPointer.y
        }
        this.$store.commit('setCamera', offset);
      } else {
        this.$store.commit('dragStart');
      }
    },
    handleTouchMove(e){
      if (e.touches.length === 2) {
          this.$store.commit('dragStart');

          e.preventDefault();
          let hypo = Math.hypot(
            (e.touches[0].pageX - e.touches[1].pageX),
            (e.touches[0].pageY - e.touches[1].pageY)
          );

          let center = {
            x: (e.touches[0].pageX + e.touches[1].pageX)/2,
            y: (e.touches[0].pageY + e.touches[1].pageY)/2
          }

          if (this.hypo === null) {
              this.hypo = hypo;
          }

          let scale = ((hypo / this.hypo) - 1)/10
          // this.scale = scale

          let desiredZoom = this.cameraZoom.zoom + scale;
          desiredZoom = Math.min(Math.max(desiredZoom, this.cameraMinZoom), 1);

          this.$store.commit('setCameraZoom', {
            zoom: desiredZoom,
            center
          });

          this.hypo = hypo;
      }
    },
    handleTouchEnd(){
      this.hypo = null
      setTimeout(() => {
        this.$store.commit('dragEnd');
      },50)
    }
  },
  beforeMount() {
  },
  mounted() {
    //storing throttled event handlers so we can remove them later
    this.tHandlePanMove = throttled(25, this.handlePanMove);
    this.tHandleCursorMove = throttled(25, this.handleCursorMove);

    document.addEventListener('wheel', this.handleScroll, { passive: false});
    window.addEventListener('blur', this.handlePanEnd);
    document.body.addEventListener('mousemove', this.tHandleCursorMove);
    document.body.addEventListener('mousedown', this.handlePanStart);
    document.body.addEventListener('mouseup', this.handlePanEnd);
    document.body.addEventListener('mouseleave', this.handlePanEnd);
    document.body.addEventListener('touchmove', this.handleTouchMove, false);
    document.body.addEventListener('touchend', this.handleTouchEnd, false);
  },
  beforeDestroy() {
    document.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('blur', this.handlePanEnd);
    document.body.removeEventListener('mousemove', this.tHandleCursorMove);
    document.body.removeEventListener('mousedown', this.handlePanStart);
    document.body.removeEventListener('mouseup', this.handlePanEnd);
    document.body.removeEventListener('mouseleave', this.handlePanEnd);
    document.body.removeEventListener('touchmove', this.handleTouchMove, false);
    document.body.removeEventListener('touchend', this.handleTouchEnd, false);
  }
}
</script>

<style scoped lang="scss">
</style>
		