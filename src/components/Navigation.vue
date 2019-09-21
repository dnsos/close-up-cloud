<template>
  <nav>
    <router-link to="/viz">Visualisierung</router-link>
    <router-link to="/info">Über das Projekt</router-link>
  </nav>
</template>

<script>
export default {
  name: 'navigation'
}
</script>

<style lang="scss" scoped>
nav {
  >*:not(:last-child) {
    margin-right: .5rem;
  }
}
</style>
