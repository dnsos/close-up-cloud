<template>
  <section class="home__section home__landingpage">
    <div class="section__wrapper section__landingpage">
      <div class="video__wrapper">
        <video :src="animatedLogo" autoplay="true" muted="true"></video>
      </div>
      <p>Eine experimentelle Visualisierung zur Erkundung von Bildsammlungen</p>
      <router-link class="button button__viz button--primary" to="/viz" exact>Zur Visualisierung</router-link>
      <a class="button button__about" href="#about">Über das Projekt</a>
    </div>
  </section>
</template>

<script>
export default {
  name: "landingpage",
  computed: {
    animatedLogo: function() {
      return `${process.env.VUE_APP_URL_LOGOS}/CUC_Logo_AnimationX2.mp4`;
    }
  }
};
</script>

<style scoped lang="scss">
.home__landingpage {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--color-canvas);

  .section__landingpage {
    width: 80%;
    max-width: 55rem;
    padding-top: 0;
  }
}

.button__viz,
.button__about {
  padding: 1rem 1.5rem 0.875rem;
  color: var(--color-ui-highlighted);
  margin-bottom: calc(var(--grid-spacing) / 2);
}
.button__about {
  margin-left: calc(var(--grid-spacing) / 2);
}

.video__wrapper {
  position: relative;
  max-width: 1250px;
  margin: 0 auto;
  padding-top: percentage(150/500);

  video {
    position: absolute;
    top: 0;
    left: 1.5rem;
    width: 100%;
  }
}

.section__landingpage p {
  margin-bottom: 3rem;
  margin-left: -1.5rem;
}
//fade in text
.section__landingpage p,
.section__landingpage a {
  opacity: 0;
  transition: opacity 1s;
}
html.wf-active {
  .section__landingpage p,
  .section__landingpage a {
    opacity: 1;
  }
}
</style>
