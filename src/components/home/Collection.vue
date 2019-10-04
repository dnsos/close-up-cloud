<template>
  <section class="home__section">
    <div class="section__wrapper grid-12-columns">
      <div class="collection__figure">
        Sammlung Bilder
      </div>
      <div class="collection__text">
        <h2>Die Sammlung: Glasnegative von Wilhelm Weimar</h2>
        <p>Text über die Sammlung. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minus quas obcaecati repellendus atque nesciunt voluptatibus dicta labore ab unde omnis magnam, culpa, eligendi tempora harum commodi, iste quam sequi! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex accusantium cumque autem odio facere, iste quaerat quasi qui natus incidunt repudiandae modi! Impedit accusamus maiores tempora aliquid iste a eveniet?</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint cupiditate nesciunt nostrum, dolorum placeat quaerat, labore consequatur omnis ducimus amet distinctio doloremque necessitatibus neque vitae ipsa atque quia assumenda quasi! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae nam aspernatur veritatis ullam sequi accusantium tempora cumque ad! Aliquid unde quod ad tempore minima velit at impedit quaerat doloribus laboriosam!</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'collection'
}
</script>

<style scoped lang="scss">
@media screen and (max-width: 750px) {
  .collection__figure, .collection__text {
    grid-column: span 12;
  }
}
@media screen and (min-width: 750px) {
  .collection__figure, .collection__text {
    grid-column: span 6;
  }
}
</style>
