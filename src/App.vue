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
  --font-size-small: 12px;
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
  width: 100%;
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
a {
  color: var(--color-primary-100);
  text-decoration: none;
}

button, .button {
  font-weight: 600;
  color: var(--color-primary-100);
  background-color: var(--color-primary-0);
  border: .15rem solid;
  cursor: pointer;
  transition: color 2s ease-in-out, background-color 2s ease-in-out, border-color 2s ease-in-out;

  &:not(.button--primary) {
    padding: 0;
    border-color: transparent;
    &:focus {
      outline: .1rem dotted var(--color-primary-0);
    }
  }

  &.button--primary {
    padding: calc(var(--grid-spacing)/4);
    border-color: var(--color-primary-100);
    &:focus {
      outline: .1rem dotted var(--color-primary-100);
    }
  }
}



/* DEBUG
----------------------------------------------------- */
#d3debug {
  display: none;
  position: absolute; 
  transform-origin: top left;
  transform: scale(0.25);
  border: 8px solid #eee;
  top: 0;
  left: 0;
  z-index: 1;
}

.vizhtml {
  display: none;  
  position: fixed;
  right: 0;
  width: 320px;
  height: 90vh;
  transform-origin: top right;
  overflow: auto;
  padding: 8px;
  overflow: auto;
}
.tag {
    padding: 16px;
    margin: 16px;
    background: #eee;
}
.obj {
    padding: 16px;
    margin: 16px;
    border: 1px solid #999;
}
.tile {
  width: 64px;
  height: 64px;
  background-size: cover;
  display: inline-block;
}
.cutout {
    width: 128px;
    height: 128px;
    display: inline-block;
    margin: 8px;
    word-break: break-word;
    line-height: 1;
    overflow: hidden;
    background-size: cover;
}
.detailobj {
    height: 128px;
    background: center no-repeat;
    background-size: contain;
}
</style>
