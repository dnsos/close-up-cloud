<template>
  <div>
    Viz Input Watcher
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventBus from '../eventbus.js';

export default {
  name: 'viz-transition',
  data: function() {
    return {
    }
  },
  computed: {
  ...mapState(['vizContainer']),
  },
  watch: {
  },
  methods: {
    handleScroll(e) {
      if( e.deltaY > 0 ) {		
        EventBus.$emit('zoomOut');
      } else {	
        EventBus.$emit('zoomIn');
      }
    }
  },
  beforeMount() {
  },
  mounted() {    
    document.addEventListener('wheel', this.handleScroll);
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
</style>
		