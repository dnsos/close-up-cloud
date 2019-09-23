<template>
  <header>
    <router-link to="/viz" exact>Close-Up Cloud</router-link>
    <h1>{{ headerData.title }}</h1>
    <div class="count__wrapper" v-if="headerData.closeupCount != null">
      <span>
        <span class="count">{{ headerData.closeupCount }}</span>
        Close-Ups
        <span v-if="headerData.objectCount">
          in
          <span class="count">{{ headerData.objectCount }}</span>
          {{ headerData.objectCount > 1 ? 'Objekten' : 'Objekt' }}
        </span>
      </span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'info-header',
  data: function () {
    return {
      headerData: {
        title: null,
        closeupCount: null,
        objectCount: null
      }
    }
  },
  computed: {
    ...mapState(['dataFetched'])
  },
  methods: {
    getHeaderData: function (route) {

      if (route.name === 'viz-overview') {
        this.headerData.title = 'Wilhelm Weimars Glasnegative'
        this.headerData.closeupCount = this.$store.getters.totalNumberOfCloseups
        this.headerData.objectCount = this.$store.state.data.length
      }

      else if (route.name === 'viz-tag') {
        const tagData = this.$store.getters.tag(route.params.id)
        this.headerData.title = route.params.id
        this.headerData.closeupCount = tagData.tagCount
        this.headerData.objectCount = tagData.objectCount
      }

      else if (route.name === 'viz-detail') {
        const objectData = this.$store.getters.object(route.params.id)

        let count = 0
        objectData.tags.map(tag => count += tag.geometry.length)
        
        this.headerData.title = objectData.title
        this.headerData.closeupCount = count
        this.headerData.objectCount = null
      }
    }
  },
  watch: {
    $route: function (newRoute) {
      // call getHeaderData whenever user navigates within app
      this.getHeaderData(newRoute)
    },
    dataFetched: function () {
      // ensure that data and taglist exist, then getHeaderData
      this.getHeaderData(this.$route)
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
