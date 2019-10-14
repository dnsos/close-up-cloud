<template>
  <section class="home__section home__landingpage">
    <div class="section__wrapper section__landingpage">
      <video
        :src="animatedLogo"
        width="500"
        autoplay="true"
        muted="true"
        loop="true"
      ></video>
      <p>Die Close-Up Cloud ist eine experimentelle Visualisierungstechnologie für die Erkundung verschlagworteter Bildsammlungen.</p>
      <button class="button__viz button--primary"><router-link to="/viz" exact>Zur Visualisierung</router-link></button>
      <button class="button__about"><a href="#about">Über das Projekt</a></button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'landingpage',
  computed: {
    animatedLogo: function (id) {
      return `${process.env.VUE_APP_URL_LOGOS}/CUC_Logo_Animation.mp4`
    }
  }
}
</script>

<style scoped lang="scss">
.home__landingpage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* background-color: var(--color-canvas); */

  .section__landingpage {
    width: 80%;
    max-width: 55rem;
    padding-top: 0;
  }
}

.logo--animated {
  width: 100%;
}

.button__viz, .button__about {
  margin-bottom: calc(var(--grid-spacing)/2);
}
.button__about {
  margin-left: calc(var(--grid-spacing)/2);
}
</style>
