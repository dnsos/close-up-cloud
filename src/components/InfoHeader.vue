<template>
  <header>
    <router-link to="/viz" exact>Close-Up Cloud</router-link>
    <h1>{{ currentData.title }}</h1>
    <div class="count__wrapper">
      <span>
        <span class="count">{{ currentData.closeupCount }}</span>
        Close-Ups
        <span v-if="currentData.objectCount != null">
          in
          <span class="count">{{ currentData.objectCount }}</span>
          {{ currentData.objectCount > 1 ? 'Objekten' : 'Objekt' }}
        </span>
      </span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'info-header',
  props: {
    currentData: {
      type: Object,
      default: function () {
        return {
          title: '[Unbekannt]',
          closeupCount: 0,
          objectCount: 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  position: absolute;
  top: var(--padding-outer);
  left: var(--padding-outer);
  > * {
    margin: 0;
  }
  > *:not(h1) {
    text-transform: uppercase;
    letter-spacing: .05rem;
  }
  a, .router-link-active {
    color: var(--color-ui-primary);
  }
  .count__wrapper {
    padding-left: var(--grid-spacing);

    .count {
      font-weight: var(--font-weight-bold);
    }
  }
}
</style>
