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
  --font-size-small: 13px;
  --font-family-primary: 'Overpass', sans-serif;
  --grid-spacing: 2.5rem;
  --padding-outer: 1.5rem;
  --border-width: .1rem;
  --border-solid: var(--border-width) solid var(--color-ui-primary);
  --border-dotted: var(--border-width) dotted var(--color-ui-primary);

  --icon-size: calc(var(--grid-spacing)*1.5);

  --transition-duration: 2s;

  --transition-color: color var(--transition-duration) ease-in-out;
  --transition-bg-color: background-color var(--transition-duration) ease-in-out;

  // font weights
  --font-weight-regular: 400;
  --font-weight-medium: 600;
  --font-weight-bold: 800;

  // colors
  --color-gold-medium: #AE9962;
  --color-gold-dark: #887031;
  --color-neutral-100: hsl(0, 0%, 0%);
  --color-neutral-75: hsl(0, 0%, 25%);
  --color-neutral-60: hsl(0, 0%, 40%);
  --color-neutral-50: hsl(0, 0%, 50%);
  --color-neutral-25: hsl(0, 0%, 75%);
  --color-neutral-5: hsl(0, 0%, 95%);
  --color-neutral-0: hsl(0, 0%, 100%);

  // theme specific styles
  --color-canvas: var(--color-neutral-5);
  --color-ui-bg: var(--color-neutral-0);
  --color-ui-primary: var(--color-neutral-75);
  --color-ui-secondary: var(--color-neutral-25);
  --color-ui-highlighted: var(--color-gold-dark);
}

[data-theme="dark"] {
  // theme specific
  --color-canvas: var(--color-neutral-75);
  --color-ui-bg: var(--color-neutral-100);
  --color-ui-primary: var(--color-neutral-5);
  --color-ui-secondary: var(--color-neutral-50);
  --color-ui-highlighted: var(--color-gold-medium);
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
  font-weight: var(--font-weight-medium);
  * {
    box-sizing: border-box;
  }
}

/* APP
----------------------------------------------------- */
#app {
  width: 100%;
  height: 100vh;
  color: var(--color-ui-primary);
  font-weight: var(--font-weight-medium);
  >* {
    width: 100%;
    height: 100%;
  }
}

/* CLASSES
----------------------------------------------------- */

/* TYPOGRAPHY
----------------------------------------------------- */
.font-uppercase {
  text-transform: uppercase;
  letter-spacing: .05rem;
}
.font-bold {
  font-weight: var(--font-weight-bold);
}
h1 {
  font-size: 2.8rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-ui-highlighted);
}
p, span {
  color: var(--color-ui-primary);
}
a {
  color: var(--color-ui-primary);
  text-decoration: none;
  transition: color .2s ease-in;
  &:hover {
    color: var(--color-ui-highlighted);
  }
  &:focus {
    color: var(--color-ui-highlighted);
    outline: var(--border-dotted);
  }
  &.router-link-active {
    color: var(--color-ui-highlighted);
  }
}

button, .button {
  font-weight: 600;
  color: var(--color-ui-primary);
  background-color: var(--color-ui-bg);
  border: var(--border-width) solid;
  cursor: pointer;

  &:not(.button--primary) {
    padding: 0;
    border-color: transparent;
    &:focus {
      outline: var(--border-dotted);
    }
  }

  &.button--primary {
    padding: calc(var(--grid-spacing)/4);
    border-color: var(--color-ui-primary);
    &:focus {
      outline: var(--border-dotted);
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
