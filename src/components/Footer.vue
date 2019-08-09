<template>
  <footer class="grid-footer columns-3">
    <span>Entdecken</span>
    <div>
      <button class="button__toggle-mode" @click="toggleMode()">Farben umkehren</button>
    </div>
    <span>Info</span>
  </footer>
</template>

<script>
export default {
  name: 'grid-footer',
  methods: {
    toggleMode: function () {
      this.$store.commit('toggleMode')
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-footer {
  color: var(--color-primary-0);
  background-color: var(--color-primary-100);
}
</style>
