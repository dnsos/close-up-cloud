<template>
  <section class="home__section home__landingpage">
    <div class="section__wrapper section__landingpage">
      <h1>Close-Up Cloud</h1>
      <p>Die Close-Up Cloud ist eine experimentelle Visualisierungstechnologie für die Erkundung verschlagworteter Bildsammlungen.</p>
      <button class="button--primary"><router-link to="/viz" exact>Zur Visualisierung</router-link></button>
      <button class="button__about"><a href="#about">Über das Projekt</a></button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'landingpage'
}
</script>

<style scoped lang="scss">
.home__landingpage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--color-canvas);

  .section__landingpage {
    width: 50%;
    padding-top: 0;
  }
}
.button__about {
  margin-left: calc(var(--grid-spacing)/2);
}
</style>
