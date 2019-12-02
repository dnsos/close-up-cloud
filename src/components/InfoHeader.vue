<template>
  <header class="info-header">
    <router-link to="/viz" exact class="info-header__cuc">
      <img :src="logoFile" alt="Logo Close-Up Cloud" class="info-header__icon filter-invert">
      <span class="logo-name">Close-Up <span style="font-weight: 400">Cloud</span></span>
    </router-link>
    <div class="info-header__data" v-if="headerDataAvailable">
      <h1 class="info-header__title">{{ headerData.title }}</h1>
      <div class="info-header__counter">
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
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'info-header',
  data: function () {
    return {
      headerDataAvailable: false,
      headerData: {
        title: null,
        closeupCount: null,
        objectCount: null
      }
    }
  },
  computed: {
    ...mapState(['dataFetched']),
    logoFile: function () {
      return `${process.env.VUE_APP_URL_LOGOS}/CUC_Logo.png`
    }
  },
  methods: {
    getHeaderData: function (route) {
      this.headerDataAvailable = false

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

      this.headerDataAvailable = true
    }
  },
  watch: {
    $route: function (newRoute) { 
      // call getHeaderData whenever user navigates within app
      this.getHeaderData(newRoute)
    }
  },
  beforeMount: function() {
    this.getHeaderData(this.$route)
  }
}
</script>

<style lang="scss" scoped>
.info-header {
  position: absolute;
  top: var(--padding-outer);
  left: var(--padding-outer);

  .info-header__cuc,
  .info-header__counter {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: .0125rem;
  }

  .info-header__cuc {
    display: flex;
    align-items: center;
    color: #1e1e1e;
  }
  .logo-name {
    line-height: 1;
    margin-left: 12px;
    transform: translateY(1px);
  }

  .info-header__data {
    padding-left: var(--grid-spacing);
  }

  .info-header__title {
    margin: 0;
  }
  
  .info-header__icon {
    width: 26px;
    height: 26px;
  }

  .info-header__counter {
    padding-left: var(--grid-spacing);
    .count {
      font-weight: var(--font-weight-bold);
    }
  }
}
</style>
