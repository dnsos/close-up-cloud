<template>
  <div>
    Viz Input Watcher
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'viz-transition',
  data: function() {
    return {
      panStartPointer: { x: 0, y: 0 },
      panStartCam: { x: 0, y: 0 }
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
      let deltaZoom = Math.abs(e.deltaY);
      
      //on a touchpad or magic mouse, deltaY is around 1-6
      //event is called way more often
      if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        deltaZoom /= 500;
      //on a default mouse on windows, deltaY is 100
      //event is called with every wheel step
      } else {
        deltaZoom /= 2500;
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
      document.body.addEventListener('mousemove', this.handlePanMove);
    },
    handlePanEnd() {
      this.$store.commit('dragEnd');
      document.body.removeEventListener('mousemove', this.handlePanMove);
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
    }
  },
  beforeMount() {
  },
  mounted() {
    document.addEventListener('wheel', this.handleScroll, { passive: false});
    window.addEventListener('blur', this.handlePanEnd);
    document.body.addEventListener('mousemove', this.handleCursorMove);
    document.body.addEventListener('mousedown', this.handlePanStart);
    document.body.addEventListener('mouseup', this.handlePanEnd);
    document.body.addEventListener('mouseleave', this.handlePanEnd);
  },
  beforeDestroy() {
    document.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('blur', this.handlePanEnd);
    document.body.addEventListener('mousemove', this.handleCursorMove);
    document.body.removeEventListener('mousedown', this.handlePanStart);
    document.body.removeEventListener('mouseup', this.handlePanEnd);
    document.body.removeEventListener('mouseleave', this.handlePanEnd);
  }
}
</script>

<style scoped lang="scss">
</style>
		