<template>
  <div class="view__viz">
    <main class="layer__viz">
      <VizRenderer v-if="hasFetched" />
    </main>
    <VizOverlay class="layer__overlay" />
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
  overflow: hidden;
}

.layer__viz { 
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layer__overlay { 
  z-index: 1;
}
</style>
