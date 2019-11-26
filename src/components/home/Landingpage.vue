<template>
  <section class="home__section home__landingpage">
    <div class="section__wrapper section__landingpage">
      <div class="video__wrapper">
        <video
          :src="animatedLogo"
          autoplay="true"
          muted="true"
        ></video>
      </div>
      <p>Die Close-Up Cloud ist eine experimentelle Visualisierungstechnologie für die Erkundung verschlagworteter Bildsammlungen.</p>
      <router-link class="button button__viz button--primary" to="/viz" exact>Zur Visualisierung</router-link>
      <a class="button button__about" href="#about">Über das Projekt</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'landingpage',
  computed: {
    animatedLogo: function () {
      return `${process.env.VUE_APP_URL_LOGOS}/CUC_Logo_Animation.mp4`
    }
  }
}
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

.button__viz, .button__about {
  padding: 1rem 1.5rem 0.875rem;
  color: var(--color-ui-highlighted);
  margin-bottom: calc(var(--grid-spacing)/2);
}
.button__about {
  margin-left: calc(var(--grid-spacing)/2);
}

.video__wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  padding-top: percentage(150/500); //aspect ratio of the video

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
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
