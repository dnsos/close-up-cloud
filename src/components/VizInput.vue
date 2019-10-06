<template>
  <div>
    Viz Input Watcher
  </div>
</template>

<script>
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
  ...mapState(['camera', 'cameraZoom', 'cameraMinZoom', 'isDragging']),
  },
  watch: {
  },
  methods: {
    handleScroll(e) {
      let desiredZoom = this.cameraZoom.zoom;
      if( e.deltaY > 0 ) {		
        desiredZoom -= (this.cameraZoom.zoom/4);
        desiredZoom = Math.max(desiredZoom, this.cameraMinZoom);
      } else {
        desiredZoom += (this.cameraZoom.zoom/4);
        desiredZoom = Math.min(desiredZoom, 1);
      }
      this.$store.commit('setCameraZoom', {
        zoom: desiredZoom,
        time: durations.mouseZoom
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
      const offset = {
        x: this.panStartCam.x + e.clientX - this.panStartPointer.x,
        y: this.panStartCam.y + e.clientY - this.panStartPointer.y
      }
      this.$store.commit('setCamera', offset);
      if(!this.isDragging) this.$store.commit('dragStart');
    }
  },
  beforeMount() {
  },
  mounted() {
    document.addEventListener('wheel', this.handleScroll);
    window.addEventListener('blur', this.handlePanEnd);
    document.body.addEventListener('mousedown', this.handlePanStart);
    document.body.addEventListener('mouseup', this.handlePanEnd);
    document.body.addEventListener('mouseleave', this.handlePanEnd);
  },
  beforeDestroy() {
    document.removeEventListener('wheel', this.handleScroll);
    window.removeEventListener('blur', this.handlePanEnd);
    document.body.removeEventListener('mousedown', this.handlePanStart);
    document.body.removeEventListener('mouseup', this.handlePanEnd);
    document.body.removeEventListener('mouseleave', this.handlePanEnd);
  }
}
</script>

<style scoped lang="scss">
</style>
		