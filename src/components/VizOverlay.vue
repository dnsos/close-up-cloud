<template>
  <div class="overlay__wrapper">
    <div class="overlay__top overlay__left">
      <router-link v-if="isView('viz-overview')" to="/" exact>Close-Up Cloud</router-link>
      <div v-else-if="isView('viz-tag') && currentTagData && currentTagData">
        {{currentTagData.title}}&nbsp;in
        <br>
        {{currentTagData.objectCount}}&nbsp;{{ currentTagData.objectCount > 1 ? 'Objekten' : 'Objekt' }}
      </div>
      <div v-else-if="isView('viz-detail') && currentObjectData">
        {{currentObjectData.title}}
      </div>
    </div>
    <div class="overlay__top overlay__right">
      <Navigation />
    </div>
    <div class="overlay__bottom overlay__left">
      <button v-if="isView('viz-detail')">Entdecken</button>
    </div>
    <div class="overlay__bottom overlay__center">
      <button @click="toggleColors()">Farben umkehren</button>
    </div>
    <ObjectData
      v-if="isView('viz-detail') && currentObjectData"
      :objectData="currentObjectData"
      class="overlay__bottom overlay__right"
    />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import ObjectData from '@/components/ObjectData.vue'

//@todo this component could be split up in 1) general overlay (logo, invert) 
//and 2) multiple view-dependent overlays (overview, tag, detail)

export default {
  name: 'viz-overlay',
  components: { Navigation, ObjectData },
  computed: {
    currentTagData: function () {
      if (this.$route.name != 'viz-tag') return
      return this.$store.getters.tag(this.$route.params.id)
    },
    currentObjectData: function () {
      if (this.$route.name != 'viz-detail') return
      return this.$store.getters.object(this.$route.params.id)
    }
  },
  methods: {
    isView: function (view) {
      return this.$route.name === view
    },
    toggleColors: function () {
      this.$store.commit('toggleColors')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay__wrapper {
  & > * {
    position: absolute;
    padding: calc(var(--grid-spacing)/2);
    color: var(--color-primary-100);
    background-color: var(--color-primary-0);
    transition: background-color 2s ease-in-out, color 2s ease-in-out;
  }
}

.overlay__left {
  left: 0;
}

.overlay__right {
  right: 0;
}

.overlay__top {
  top: 0;
}

.overlay__bottom {
  bottom: 0;
}

.overlay__center {
  left: 50%; // TODO: center properly
}
</style>
