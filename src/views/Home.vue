<template>
  <div class="view__home">
    <div class="home__wrapper">
      <h1>Close-Up Cloud</h1>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos cum, repellat quaerat porro aspernatur repudiandae ipsam perferendis sed sequi dolore suscipit, ipsa tempore provident explicabo voluptates ipsum doloremque itaque debitis.</p>
      <button class="button--primary"><router-link to="/viz" exact>Zur Visualisierung</router-link></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<style scoped lang="scss">
.view__home {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-ui-primary);
  background-color: var(--color-ui-bg);

  .home__wrapper {
    max-width: 50%;
  }
}
</style>
