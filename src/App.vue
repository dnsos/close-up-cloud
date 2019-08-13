<template>
  <div id="app" :data-theme="[ inverted ? 'dark' : 'light']">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
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
  --color-primary-100: hsl(0, 0%, 10%);
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
  --color-primary-0: hsl(0, 0%, 10%);
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
  font-weight: 600;
  * {
    box-sizing: border-box;
  }
}

/* APP
----------------------------------------------------- */
#app {
  width: 100vw;
  height: 100vh;
  >* {
    width: 100%;
    height: 100%;
  }
}

/* GRIDS
----------------------------------------------------- */
.grid-3-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: calc(var(--grid-spacing)/4);
    >:nth-child(1) { text-align: left; }
    >:nth-child(2) { text-align: center; }
    >:nth-child(3) { text-align: right; }
  }

/* TYPOGRAPHY
----------------------------------------------------- */
button {
  font-weight: 600;
  color: var(--color-primary-100);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 2s ease-in-out;
  &:focus {
    outline: .1rem dotted var(--color-primary-0);
  }
}
</style>
