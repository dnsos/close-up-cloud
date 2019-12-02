<template>
  <section class="home__section">
    <div class="section__wrapper section__about grid-12-columns" id="about">
      <div class="about__text">
        <div class="text-block">
          <h2>Das Projekt</h2>
          <p>
            Die Close-Up Cloud ermöglicht die visuelle Erkundung einer Sammlung von 
            historischen Glasnegativen. Eine Übersicht aus Nahaufnahmen lädt die 
            Betrachter*innen dazu ein, sich mit der Sammlung vertraut zu machen und 
            ihren Detailreichtum zu erforschen. Die Größe der einzelnen Abbildungen 
            verdeutlicht dabei die quantitative Verteilung der ikonografischen Details 
            in der Sammlung. Die Nahaufnahmen sind die visuellen Navigationselemente, 
            über die die Sammlung erkundet werden kann.
          </p>
          <p>
            Die Visualisierung macht die Glasnegative auf eine Weise erfahrbar, die mit 
            den physischen Objekten nicht möglich wäre. Zwar können auch mit Hilfe eines 
            Leuchttisches eine Fülle an Details einzelner Glasnegative und ihre Tiefenschärfe 
            untersucht werden. Die Close-Up Cloud erweitert den Zugang um eine Übersicht 
            aller Schlagworte, die in der Sammlung vergeben worden sind und lädt zum 
            interaktiven Erkunden ein.
          </p>
        </div>
      </div>
      <div class="about__video" ref="videoWrapper">
        <video controls :width="videoWrapperWidth" poster="assets/video/sequenz2_2311_720_2_poster.png">
          <source src="assets/video/sequenz2_2311_720_2.mov" type="video/mp4" />
          <!-- <source src="" type="video/webm"> -->
          Video
        </video>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "project",
  data: function() {
    return {
      videoWrapperWidth: 320
    };
  },
  mounted: function() {
    this.videoWrapperWidth = this.$refs.videoWrapper.offsetWidth;

    window.addEventListener("resize", () => {
      this.videoWrapperWidth = this.$refs.videoWrapper.offsetWidth;
    });
  }
};
</script>

<style scoped lang="scss">
.about__text,
.about__video {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 750px) {
  .about__text {
    grid-column: span 12;
  }
  .about__video {
    grid-column: span 12;
  }
}
@media screen and (min-width: 750px) {
  .about__text {
    grid-column: 1 / 7;
  }
  .about__video {
    grid-column: 7 / 13;
  }
}
</style>
