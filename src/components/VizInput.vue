<template>
  <div>
    Viz Input Watcher
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import EventBus from '../eventbus.js';
import { durations } from '../variables.js'

export default {
  name: 'viz-transition',
  data: function() {
    return {
      panStartPointer: { x: 0, y: 0 },
      panStartCam: { x: 0, y: 0 }
    }
  },
  computed: {
  ...mapState(['vizContainer', 'canvas', 'camera', 'cameraZoom', 'cameraMinZoom', 'cursor', 'isDragging']),
  },
  watch: {
  },
  methods: {
    handleScroll(e) {
      let desiredZoom = this.cameraZoom.zoom;
      if( e.deltaY > 0 ) {		
        desiredZoom -= (this.cameraZoom.zoom/8);
        desiredZoom = Math.max(desiredZoom, this.cameraMinZoom);
      } else {
        desiredZoom += (this.cameraZoom.zoom/8);
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
      this.panStartPointer = { 
        x: e.clientX,
        y: e.clientY
      };
      this.panStartCam = { ...this.camera };
      document.body.addEventListener('mousemove', this.handlePanMove);
    },
    handlePanEnd(e) {
      this.$store.commit('dragEnd');
      document.body.removeEventListener('mousemove', this.handlePanMove);
    },
    handlePanMove(e) {
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
    document.addEventListener('wheel', this.handleScroll);
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
		