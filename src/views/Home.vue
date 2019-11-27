<template>
  <div class="view__home">
    <Landingpage />
    <Project />
    <Collection />
    <Publications />
    <Participants />
    <CreditsFooter />
  </div>
</template>

<script>
import Landingpage from "@/components/home/Landingpage.vue";
import Project from "@/components/home/Project.vue";
import Publications from "@/components/home/Publications.vue";
import Collection from "@/components/home/Collection.vue";
import Participants from "@/components/home/Participants.vue";
import CreditsFooter from "@/components/home/CreditsFooter.vue";

export default {
  name: "home",
  components: {
    Landingpage,
    Project,
    Publications,
    Collection,
    Participants,
    CreditsFooter
  },
  beforeMount: function() {
    this.$store.commit("setBrightColors");
    this.$store.state.isMkg = this.$route.path === "/mkg";
  }
};
</script>

<style lang="scss">
.view__home {
  width: 100%;
  height: auto;
  color: var(--color-ui-primary);
}

.home__section {
  width: 100%;
  padding: var(--grid-spacing);
  /* display: flex;
    justify-content: center;
    align-items: center; */
}

.section__wrapper {
  width: auto;
  max-width: 960px;
  padding-top: calc(var(--grid-spacing) * 4);
  margin: 0 auto;
}

/* GRIDS
------------------------------------------ */
.grid-12-columns {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--grid-spacing);
}
</style>
