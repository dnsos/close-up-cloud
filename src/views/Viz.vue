<template>
  <div class="view__viz">
    <main class="layer__viz">
      <VizRenderer v-if="hasFetched" />
    </main>
    <div class="layer__overlay">
      <VizOverlay />
    </div>
  </div>
</template>

<script>
import VizRenderer from '@/components/VizRenderer.vue'
import VizOverlay from '@/components/VizOverlay.vue'

export default {
  name: 'viz',
  components: { VizRenderer, VizOverlay },
  data: function () {
    return {
      hasFetched: false
    }
  },
  mounted: function() {
    console.log('Hello this is a Viz')
    
    this.$store.dispatch('fetchData').then(() => {
      this.hasFetched = true;
    });
  }
}
</script>

<style lang="scss" scoped>
.view__viz {
  font-size: var(--font-size-small);
  overflow: hidden;
  z-index: 0;
}

.layer__viz { 
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
