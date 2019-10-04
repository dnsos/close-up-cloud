<template>
  <section class="home__section">
    <div class="section__wrapper grid-12-columns">
      <div class="publications">
        <h2>Vorträge & Veröffentlichungen</h2>
        <p class="publication__item"><a href="https://www.mkg-hamburg.de/de/ausstellungen/vorschau/das-zweite-original.html" target="_blank">Das zweite Original.</a> Ausstellung im Museum für Kunst und Gewerbe Hamburg (MKG), 6. Dezember 2019 bis 2. Juni 2020.</p>
        <p class="publication__item">Pauline Junginger, Dennis Ostendorf, Barbara Avila Vissirini, Anastasia Voloshina, Sarah Kreiseler & Marian Dörk. <a href="https://dev.clariah.nl/files/dh2019/boa/0534.html" target="_blank">Close-Up Cloud: Gaining A Sense Of Overview From Many Details.</a> DH 2019 Utrecht – Complexities, Juli 2019.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'publications'
}
</script>

<style scoped lang="scss">
.publications {
  grid-column: 3 / 11;
}
.publication__item {
  padding: calc(var(--grid-spacing)/2);
  border: var(--border-solid);
}
</style>
