<template>
  <footer class="grid-area__footer">
    <div class="footer__content grid-3-columns">
      <span>Entdecken</span>
      <div>
        <button class="button__toggle-mode" @click="toggleMode()">Farben umkehren</button>
      </div>
      <span>Info</span>
    </div>
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
.grid-area__footer {
  color: var(--color-primary-100);
  background-color: var(--color-primary-0);
}
</style>
