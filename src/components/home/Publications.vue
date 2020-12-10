<template>
  <section class="home__section">
    <div class="section__wrapper grid-12-columns">
      <div class="publications">
        <h2>Vorträge &amp; Veröffentlichungen</h2>
        <p class="publication__item">Pauline Junginger, Dennis Ostendorf, Barbara Avila Vissirini, Anastasia Voloshina, Timo Hausmann, Sarah Kreiseler &amp; Marian Dörk. <a href="https://doi.org/10.11588/dah.2020.5.72039" target="_blank">The Close-up Cloud: Visualizing Details of Image Collections in Dynamic Overviews.</a> International Journal for Digital Art History, no. 5, 6.2-6.13, December 2020.</p>				
        <p class="publication__item"><a href="https://www.youtube.com/watch?v=ZeMl0i-B78E" target="_blank">„Das zweite Original“: Die Close-Up Cloud</a>. Ein Gespräch zwischen Barbara Avila Vissirini und Sarah Kreiseler über Inspirationen zur Visualisierung, ein Mantra in der Interfacegestaltung sowie Suchen vs Erkunden. YouTube, 25. Juni 2020.</p>
				
        <p class="publication__item"><a href="https://www.mkg-hamburg.de/de/ausstellungen/aktuell/das-zweite-original.html" target="_blank">Das zweite Original. Fotografie neu ordnen: Reproduktionen</a>. Ausstellung im Museum für Kunst und Gewerbe Hamburg (MKG), Kuratorin: Sarah Kreiseler in Zusammenarbeit mit Dr. Esther Ruelfs, 6. Dezember 2019 bis 19. Juli 2020.</p>
        <p class="publication__item">Sarah Kreiseler &amp; Barbara Avila Vissirini. Close-Up Cloud. Ikonografische Muster einer Sammlung in dynamischen Übersichten. <a href="https://www.belvedere.at/das-kunstmuseum-im-digitalen-zeitalter-2020" target="_blank">Das Kunstmuseum im digitalen Zeitalter – 2020</a>. Belvedere, Wien, 9./10. Januar 2020.</p>
        <p class="publication__item">Pauline Junginger, Dennis Ostendorf, Barbara Avila Vissirini, Anastasia Voloshina, Sarah Kreiseler &amp; Marian Dörk. <a href="https://dev.clariah.nl/files/dh2019/boa/0534.html" target="_blank">Close-Up Cloud: Gaining A Sense Of Overview From Many Details.</a> DH 2019 Utrecht – Complexities, Juli 2019.</p>
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
