<template>
  <footer class="grid-footer">
    <Navigation />
  </footer>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'grid-footer',
  components: {
    Navigation
  }
}
</script>

<style lang="scss" scoped>
.grid-footer {
  color: var(--color-grey-54);
  background-color: var(--color-primary);
}
</style>
