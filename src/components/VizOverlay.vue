<template>
  <div class="overlay">
    <div class="overlay__discover">
      <button>Entdecken</button>
    </div>
    <div class="overlay__toggle-colors">
      <button @click="toggleColors()">Farben umkehren</button>
    </div>
    <ObjectData
      v-if="isDetailView"
      :objectID="currentObjectID"
    />
  </div>
</template>

<script>
import ObjectData from '@/components/ObjectData.vue'

export default {
  name: 'viz-overlay',
  components: { ObjectData },
  computed: {
    isDetailView: function () {
      return this.$route.name === 'viz-detail'
    },
    currentObjectID: function () {
      if (this.$route.name != 'viz-detail') return
      return this.$route.params.id
    }
  },
  methods: {
    toggleColors: function () {
      this.$store.commit('toggleColors')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay > * {
  position: absolute;
  bottom: 0;

  &.overlay__discover {
    left: 0;
  }
  &.overlay__toggle-colors {
    left: 50%;
    text-align: center;
  }
}
</style>
