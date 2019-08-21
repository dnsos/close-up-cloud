<template>
  <header class="grid-area__header grid-3-columns">
    <router-link to="/" exact>Close-Up Cloud</router-link>
    <span></span>
    <Navigation />
  </header>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'viz-header',
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
