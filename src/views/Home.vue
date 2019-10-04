<template>
  <div class="view__home">
    <section class="home__section home__landingpage">
      <div class="section__wrapper section__landingpage">
        <h1>Close-Up Cloud</h1>
        <p>Die Close-Up Cloud ist eine experimentelle Visualisierungstechnologie für die Erkundung verschlagworteter Bildsammlungen.</p>
        <button class="button--primary"><router-link to="/viz" exact>Zur Visualisierung</router-link></button>
        <button class="button__about"><a href="#about">Über das Projekt</a></button>
      </div>
    </section>
    <section class="home__section">
      <div class="section__wrapper section__about grid-12-columns" id="about">
        <div class="about__text">
          <h2>Das Projekt</h2>
          <p>Text über das Projekt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ut eveniet quod ex pariatur eligendi debitis praesentium enim accusamus omnis consectetur quis veritatis earum hic odit. Consequatur possimus impedit quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae maxime sed iste illum rerum a facilis sit, eum optio! Neque odio quaerat numquam itaque vero fuga sequi quia? Quasi, aperiam?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, provident quas cum, quaerat quis veritatis expedita amet tempore reprehenderit quod modi voluptatum id cupiditate aperiam corrupti voluptate accusamus asperiores deserunt.</p>
        </div>
        <div class="about__video">
          <video controls>
            <source src="" type="video/webm">
            <source src="" type="video/mp4">
            Video
        </video>
        </div>
      </div>
    </section>
    <section class="home__section">
      <div class="section__wrapper grid-12-columns">
        <div class="publications">
          <h2>Vorträge & Veröffentlichungen</h2>
          <p class="publication__item"><a href="https://www.mkg-hamburg.de/de/ausstellungen/vorschau/das-zweite-original.html" target="_blank">Das zweite Original.</a> Ausstellung im Museum für Kunst und Gewerbe Hamburg (MKG), 6. Dezember 2019 bis 2. Juni 2020.</p>
          <p class="publication__item">Pauline Junginger, Dennis Ostendorf, Barbara Avila Vissirini, Anastasia Voloshina, Sarah Kreiseler & Marian Dörk. <a href="https://dev.clariah.nl/files/dh2019/boa/0534.html" target="_blank">Close-Up Cloud: Gaining A Sense Of Overview From Many Details.</a> DH 2019 Utrecht – Complexities, Juli 2019.</p>
        </div>
      </div>
    </section>
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
    <Participants />
    <CreditsFooter />
  </div>
</template>

<script>
import Participants from '@/components/home/Participants.vue'
import CreditsFooter from '@/components/home/CreditsFooter.vue'

export default {
  name: 'home',
  components: { Participants, CreditsFooter },
  beforeMount: function () {
    this.$store.commit('setBrightColors')
  }
}
</script>

<style lang="scss">
.view__home {
  width: 100%;
  height: auto;
  color: var(--color-ui-primary);
}

/* LANDINGPAGE
------------------------------------------ */
.home__section {
    width: 100%;
    /* min-height: 100vh; */
    padding: var(--grid-spacing);
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(.home__landingpage) {
      background-color: var(--color-ui-bg);
    }
  }
  .section__wrapper {
    width: auto;
    max-width: 960px;
    padding-top: calc(var(--grid-spacing)*4);
    margin: 0 auto;
  }

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

/* ABOUT
------------------------------------------ */
.section__about {
  .about__text {
    grid-column: 1 / 5;
  }
  .about__video {
    grid-column: 5 / 13;
  }
}

/* PUBLICATIONS
------------------------------------------ */
.publications {
  grid-column: 3 / 11;
}
.publication__item {
  padding: calc(var(--grid-spacing)/2);
  border: var(--border-solid);
}

/* COLLECTION
------------------------------------------ */
.collection__figure, .collection__text {
  grid-column: span 6;
}

/* GRIDS
------------------------------------------ */
.grid-12-columns {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--grid-spacing);
}
</style>
