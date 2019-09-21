<template>
  <header class="color-animated">
    <router-link to="/viz" exact class="font-uppercase">Close-Up Cloud</router-link>
    <h1>{{ title }}</h1>
    <div class="header__counter">
      <span class="font-uppercase">
        <span class="font-bold">{{ count.closeups }}</span>
        Close-Ups
        <span>
          in
          <span class="font-bold">{{ count.objects }}</span>
          {{ count.closeups > 1 ? 'Objekten' : 'Objekt' }}
        </span>
      </span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'info-header',
  data: function () {
    return {
      title: 'Wilhelm Weimars Glasnegative',
      count: {
        closeups: 1062,
        objects: 137
      }
    }
  },
  computed: {
    currentTagData: function () {
      if (this.$route.name != 'viz-tag') return
      return this.$store.getters.tag(this.$route.params.id)
    },
    currentObjectData: function () {
      if (this.$route.name != 'viz-detail') return
      return this.$store.getters.object(this.$route.params.id)
    }
  },
  watch: {
    $route: function (newRoute) {
      if (newRoute === 'viz-tag') {
        this.title = 'Taggg'
      } else if (newRoute === 'viz-detail') {
        this.title = 'Objecttt'
      }
    }
  },
  methods: {
    isView: function (view) {
      return this.$route.name === view
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  > * {
    margin: 0;
  }
  a {
    color: var(--color-ui-primary);
  }
  .router-link-active {
    color: var(--color-ui-primary);
  }
  .header__counter {
    padding-left: var(--grid-spacing);
  }
}
</style>
