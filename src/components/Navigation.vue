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
  a {
    color: var(--color-primary-50);
    text-decoration: none;
    transition: color .2s ease-in;
    &.router-link-active {
      color: var(--color-primary-100);
    }
  }
}
</style>
