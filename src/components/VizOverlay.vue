<template>
  <div class="overlay">
    <div class="overlay__top overlay__left">
      <InfoHeader />
    </div>
    <div @click="toggleColors()">
      <OverlayIcon
        :position="'bottom-left'"
        :tooltip="{
          side: 'right',
          title: 'Farben umkehren'
        }"
        :iconFileName="'invert.svg'"
      />
    </div>
    <div v-if="isView('viz-detail')">
      <MetadataBox
        :metadata="currentMetadata"
        :isVisible="metadataVisible"
      />
      <div @click="toggleMetadataVisible()">
        <OverlayIcon
          :position="'bottom-right'"
          :tooltip="{
            side: 'left',
            title: 'Objektinformationen'
          }"
          :iconFileName="'list.svg'"
        />
      </div>
    </div>
    <div @click="goToAbout()">
      <OverlayIcon
        :position="'top-right'"
        :tooltip="{
          side: 'left',
          title: 'Über das Projekt'
        }"
        :iconFileName="'info.svg'"
      />
    </div>
  </div>
</template>

<script>
import InfoHeader from '@/components/InfoHeader.vue'
import MetadataBox from '@/components/overlay/MetadataBox.vue'
import OverlayIcon from '@/components/overlay/OverlayIcon.vue'

export default {
  name: 'viz-overlay',
  components: { InfoHeader, MetadataBox, OverlayIcon },
  data: function () {
    return {
      metadataVisible: true
    }
  },
  computed: {
    currentMetadata: function () {
      if (this.$route.name != 'viz-detail') return
      return this.$store.getters.object(this.$route.params.id)
    }
  },
  methods: {
    toggleColors: function () {
      this.$store.commit('toggleColors')
    },
    goToAbout: function () {
      this.$router.push({ name: 'home' })
    },
    toggleMetadataVisible: function () {
      this.metadataVisible = !this.metadataVisible
    },
    isView: function (view) {
      return this.$route.name === view
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  font-size: var(--font-size-small);
  & > * {
    /* position: absolute; */
    width: 100%;
    height: 100%;
  }
}
</style>
