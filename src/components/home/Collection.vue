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
          <h2>Über die Sammlung</h2>
          <p>Ein Konvolut von rund 1700 Glasnegativen des ersten Fotografen und vorherigen Zeichner Wilhelm Weimar (1857–1917) ist am Museum für Kunst und Gewerbe Hamburg (MKG) erhalten. Auf den bis zu 18x24 cm großen Negativplatten fotografiert er über 17 Jahre kunstgewerbliche Gegenstände der schnell wachsenden Sammlung. Von massiven Truhen über elegantes Porzellan bis hin zu detailreichen Stickmustertüchern spannt sich der Motivumfang dieser Reproduktionsfotografien. Darüber hinaus geben die Negative  Hinweise wie der Fotograf Gegenstände je nach Größe und Material inszenierte und welche Hilfsmittel er dafür einsetze. Eine Auswahl von 144 Negativen des bisher erschlossenen Bestands wird in der Visualisierung über im Bild lokalisierte/verortete Schlagworte zugänglich.</p>
          <p>Die Glasnegative Wilhelm Weimars sind Teil der Sammlung Fotografie und neue Medien am MKG. Sie wurden im Rahmen des interdisziplinären Forschungsprogramms <a href="https://www.leuphana.de/institute/ipk/promotionsprogramm-primus.html" target="_blank">PriMus – Promovieren im Museum</a> (Kooperation der Leuphana Universität Lüneburg und sechs Museen der Hamburger Region) 2017 bis 2019 erschlossen und sind in der <a href="https://sammlungonline.mkg-hamburg.de/de">MKG Sammlung Online</a> veröffentlicht.</p>
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
          id: '	P2017.3.619'
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
      return `${process.env.VUE_APP_URL_DETAIL}/${id}.jpg`
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
