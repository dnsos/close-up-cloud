<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${tag.title}`">Tag {{tag.title}}</router-link>

    <VizCloud :cloudname="tag.title" :items="cloudItems" :subpath="`/viz/detail`" />
  </div>
</template>

<script>
import VizCloud from '../components/VizCloud'
import { convertTagOccurencesToCloudItems } from '../utils.js'

export default {
  name: 'viz-tag',
  components: { VizCloud },
  props: {
    tag: {
      type: Object,
      default: function() {
        return this.$store.getters.tag(this.$route.params.id)
      }
    }
  },
  computed: {
    cloudItems: function() {
      return convertTagOccurencesToCloudItems(this.tag);
    }
  },
  beforeMount: function() {
    console.log("hello this is a single tag cloud")
  },
  mounted: function() {
  },
  beforeDestroy: function() {
  }
}
</script>

<style scoped lang="scss">
</style>
