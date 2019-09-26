<template>
  <div class="overlay">
    <Tooltip />
    <InfoHeader/>
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
      <ObjectInfoBox
        :objectInfo="currentMetadata"
        :isVisible="objectInfoVisible"
      />
      <div @click="toggleobjectInfoVisible()">
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
import ObjectInfoBox from '@/components/overlay/ObjectInfoBox.vue'
import OverlayIcon from '@/components/overlay/OverlayIcon.vue'
import Tooltip from '@/components/Tooltip.vue'

export default {
  name: 'viz-overlay',
  components: { InfoHeader, ObjectInfoBox, OverlayIcon, Tooltip },
  data: function () {
    return {
      objectInfoVisible: false
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
    toggleobjectInfoVisible: function () {
      this.objectInfoVisible = !this.objectInfoVisible
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
}
</style>