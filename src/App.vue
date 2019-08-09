<template>
  <div id="app" :data-theme="[ inverted ? 'dark' : 'light']">
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
  },
  computed: {
    inverted: function () {
      return this.$store.state.inverted
    }
  }
}
</script>

<style lang="scss">
/* BASICS
----------------------------------------------------- */
:root {
  --font-size: 16px;
  --font-family-primary: 'Overpass', sans-serif;
  --grid-spacing: 2.5rem;
}

:root {
  --color-primary-100: hsl(0, 0%, 0%);
  --color-primary-75: hsl(0, 0%, 25%);
  --color-primary-50: hsl(0, 0%, 50%);
  --color-primary-25: hsl(0, 0%, 75%);
  --color-primary-0: hsl(0, 0%, 100%);
}

[data-theme="dark"] {
  --color-primary-100: hsl(0, 0%, 100%);
  --color-primary-75: hsl(0, 0%, 75%);
  --color-primary-50: hsl(0, 0%, 50%);
  --color-primary-25: hsl(0, 0%, 25%);
  --color-primary-0: hsl(0, 0%, 0%);
}

html {
  font-size: 62.5%;
}

body {
  height: 100vh;
  overflow: hidden;
  line-height: 1.6;
  font-family: var(--font-family-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: var(--font-size);
  font-weight: 600;
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
    >* { align-self: center; }
  }
  .grid-header, .grid-home, .grid-viz, .grid-info, .grid-footer {
    transition: background-color 2s ease-in-out, color 2s ease-in-out;
  }

  .columns-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    >:nth-child(1) { text-align: left; }
    >:nth-child(2) { text-align: center; }
    >:nth-child(3) { text-align: right; }
    }
}

/* TYPOGRAPHY
----------------------------------------------------- */
button {
  color: var(--color-primary-0);
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:focus {
    outline: .1rem dotted var(--color-primary-0);
  }
}
</style>
