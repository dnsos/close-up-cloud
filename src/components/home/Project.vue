<template>
  <section class="home__section">
    <div class="section__wrapper section__about grid-12-columns" id="about">
      <div class="about__text">
        <h2>Das Projekt</h2>
        <p>Text über das Projekt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, ut eveniet quod ex pariatur eligendi debitis praesentium enim accusamus omnis consectetur quis veritatis earum hic odit. Consequatur possimus impedit quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae maxime sed iste illum rerum a facilis sit, eum optio! Neque odio quaerat numquam itaque vero fuga sequi quia? Quasi, aperiam?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, provident quas cum, quaerat quis veritatis expedita amet tempore reprehenderit quod modi voluptatum id cupiditate aperiam corrupti voluptate accusamus asperiores deserunt.</p>
      </div>
      <div class="about__video" ref="videoWrapper">
        <video controls :width="videoWrapperWidth">
          <source src="" type="video/webm">
          <source src="" type="video/mp4">
          Video
      </video>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'project',
  data: function () {
    return {
      videoWrapperWidth: 320
    }
  },
  mounted: function () {
    this.videoWrapperWidth = this.$refs.videoWrapper.offsetWidth

    window.addEventListener('resize', (e) => {
      this.videoWrapperWidth = this.$refs.videoWrapper.offsetWidth
    })
  }
}
</script>

<style scoped lang="scss">
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
    grid-column: 1 / 5;
  }
  .about__video {
    grid-column: 5 / 13;
  }
}
</style>
