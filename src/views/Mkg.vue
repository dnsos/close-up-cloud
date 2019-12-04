<template>
  <div class="mkg" @click="onclick">
    <video autoplay poster="assets/video/sequenz2_2311_720_2_poster.jpg">
      <source src="assets/video/sequenz2_2311_720_2.mov" type="video/mp4" />Video
    </video>
  </div>
</template>

<script>
export default {
  name: "mkg",
  methods: {
    onclick: function() {
      // $router.go(-1)
      this.$router.push("/viz");
    }
  },
  mounted: function() {
    console.log("mkg", this.$route.path.startsWith("/mkg"));
    this.$store.state.isMkg = this.$route.path.startsWith("/mkg");
  }
};
</script>

<style lang="scss" scoped>
video {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
