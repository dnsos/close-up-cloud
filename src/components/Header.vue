<template>
  <header class="grid-header columns-3">
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
.grid-header {
  color: var(--color-primary-0);
  background-color: var(--color-primary-100);
}
</style>
