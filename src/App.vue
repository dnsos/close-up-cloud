<template>
  <div id="app">
    <grid-header class="grid-area" />
    <router-view class="grid-area" />
    <grid-footer class="grid-area" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'app',
  components: {
    'grid-header': Header,
    'grid-footer': Footer
  }
}
</script>

<style lang="scss">
/* BASICS
----------------------------------------------------- */
:root {
  --color-primary: black;
  --color-grey-76: #3e3e3e;
  --color-grey-54: #757575;
  --color-grey-31: #b1b1b1;
  --color-grey-20: #cccccc;
  --color-grey-09: #e7e7e7;
  --color-grey-04: #f5f5f5;
  --color-grey-02: #f9f9f9;
  --font-size: 16px;
  --font-family-primary: serif;
  --grid-spacing: 2.5rem;
}

html {
  font-size: 62.5%;
}

body {
  line-height: 1.6;
  font-family: var(--font-family-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: var(--font-size);
  font-weight: 400;
  color: var(--color-primary);
  * {
    box-sizing: border-box;
  }
}

/* APP
----------------------------------------------------- */
#app {
  height: 100vh;
  max-height: 100vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 4rem minmax(0, 1fr) 4rem;
  grid-template-areas:
    "h h h h h h h h h h h h"
    "m m m m m m m m m m m m"
    "f f f f f f f f f f f f";
  grid-gap: 0;
  overflow: hidden;

  > .grid-area {
    height: 100%;
  }

  .grid-header { grid-area: h; }
  .grid-home, .grid-viz, .grid-info { grid-area: m; }
  .grid-footer { grid-area: f; }
  .grid-header, .grid-footer {
    padding: calc(var(--grid-spacing)/4);
  }
}

/* TYPOGRAPHY
----------------------------------------------------- */
a {
  color: inherit;
  text-decoration: none;
  &.router-link-active {
    color: white;
  }
}
</style>
