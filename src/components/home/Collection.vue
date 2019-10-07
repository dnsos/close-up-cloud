<template>
  <section class="home__section">
    <div class="section__wrapper grid-12-columns">
      <div class="collection__figure">
        <div class="image-gallery grid-6-columns">
          <div
            v-for="image in images"
            :key="image.title"
            class="image-wrapper"
            :class="image.orientation === 'vertical' ? 'image--vertical' : 'image--horizontal'"
          >
            <img :src="getImagePath(image.id)" :alt="image.id" />
          </div>
        </div>
      </div>
      <div class="collection__text">
        <div class="text-block">
          <h2>Die Sammlung: Glasnegative von Wilhelm Weimar</h2>
          <p>Text über die Sammlung. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem minus quas obcaecati repellendus atque nesciunt voluptatibus dicta labore ab unde omnis magnam, culpa, eligendi tempora harum commodi, iste quam sequi! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex accusantium cumque autem odio facere, iste quaerat quasi qui natus incidunt repudiandae modi! Impedit accusamus maiores tempora aliquid iste a eveniet?</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint cupiditate nesciunt nostrum, dolorum placeat quaerat, labore consequatur omnis ducimus amet distinctio doloremque necessitatibus neque vitae ipsa atque quia assumenda quasi! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae nam aspernatur veritatis ullam sequi accusantium tempora cumque ad! Aliquid unde quod ad tempore minima velit at impedit quaerat doloribus laboriosam!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'collection',
  data: function () {
    return {
      images: [
        {
          orientation: 'vertical',
          id: 'P2017.3.151'
        },
        {
          orientation: 'vertical',
          id: 'P2017.3.152'
        },
        {
          orientation: 'vertical',
          id: 'P2017.3.234'
        },
        {
          orientation: 'horizontal',
          id: 'P2017.3.153'
        },
        {
          orientation: 'horizontal',
          id: 'P2017.3.422'
        }
      ]
    }
  },
  methods: {
    getImagePath: function (id) {
      return `${process.env.VUE_APP_URL_DETAIL}/${id}/${id}.jpg`
    }
  }
}
</script>

<style scoped lang="scss">
.grid-6-columns {
  width: 100%;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns: repeat(6, 1fr);
}

.image--vertical {
  grid-column: span 2;
  img { width: 90%; }
}

.image--horizontal {
  grid-column: span 3;
  img { width: 90%; }
}

.collection__figure, .collection__text {
  display:flex;
  align-items: center;
}

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
