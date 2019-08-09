<template>
  <nav>
    <router-link to="/" exact>Home</router-link>
    <router-link to="/viz" exact>Visualisierung</router-link>
    <router-link to="/info" exact>Info</router-link>
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
      color: var(--color-primary-0);
    }
  }
}
</style>
