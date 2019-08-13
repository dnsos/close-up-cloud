<template>
  <header class="grid-area__header grid-3-columns">
    <span>Close-Up Cloud</span>
    <span></span>
    <Navigation />
  </header>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'grid-header',
  components: {
    Navigation
  }
}
</script>

<style lang="scss" scoped>
.grid-area__header {
  color: var(--color-primary-100);
  background-color: var(--color-primary-0);
}
</style>
