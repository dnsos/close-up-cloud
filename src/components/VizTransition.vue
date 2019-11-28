<template>
  <div>
    Viz Transition Watcher

    <VizCloudSample
      v-for="sample in renderStack"
      ref="cloudsamples"
      :id="sample.id"
      :size="sample.size"
      :key="`viz-transition-${sample.id}`"
    />
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import { mapState } from "vuex";
import { TweenLite, Power2 } from "gsap/TweenMax";
import VizCloudSample from "./VizCloudSample.vue";
import { convertTagOccurencesToCloudItems, getCutoutUID } from "../utils.js";
import { durations } from "../variables.js";
import EventBus from "../eventbus.js";

export default {
  name: "viz-transition",
  data: function() {
    return {
      samplesContainer: null,
      fauxDetail: null,
      renderStack: []
    };
  },
  components: { VizCloudSample },
  computed: {
    ...mapState([
      "canvas",
      "viewport",
      "world",
      "vizContainer",
      "vizTransition"
    ])
  },
  watch: {
    vizTransition({ from, to }) {
      //console.log('Hi this is Viz Transition Watcher');

      if (from === "viz-overview" && to === "viz-tag") {
        this.transitionOverviewToTag();
      } else if (from === "viz-tag" && to === "viz-detail") {
        this.transitionTagToDetail();
      }
      if (from === "viz-detail" && to === "viz-tag") {
        this.transitionDetailToTag();
      }
    },
    $route() {
      if (this.fauxDetail) this.destroyFauxDetail();
      if (this.renderStack.length) this.renderStack = [];
    }
  },
  methods: {
    transitionOverviewToTag() {
      const loader = new PIXI.Loader();
      const tagTitle = this.vizTransition.targetId;

      //collect all first geometries of selected tag as sample ids
      const tag = this.$store.getters.tag(tagTitle);
      const samples = tag.occurrences.map(occ => {
        return {
          id: getCutoutUID(
            occ.origin,
            tag.title,
            occ.geometry[0].x,
            occ.geometry[0].y
          )
        };
      });
      this.stageSamples(loader, samples);

      this.prepareForceLayout();

      EventBus.$emit("centerWorld", durations.sampleSpreadDelay);

      loader.load(() => {
        window.setTimeout(() => {
          //Zoom viewport to fit the next view
          const targetBBox = this.$store.getters.cloudBBox(tagTitle);
          this.$store.dispatch("computeWorldSize", targetBBox);
          EventBus.$emit("zoomToWorld");

          //Spread out target VizCloudSamples
          const targetPositions = this.$store.state.clouds[tagTitle];
          EventBus.$emit("spreadCloudItemSamples", {
            targetId: tagTitle,
            targetPositions
          });
          //Route to the target view
          //@todo no timeouts / better handling
          window.setTimeout(() => {
            this.$router.push({ path: this.vizTransition.targetPath });
          }, durations.sampleSpread * 1000);
        }, durations.sampleSpreadDelay * 1000);
      });
    },

    transitionTagToDetail() {
      const loader = new PIXI.Loader();
      const tagTitle = this.$route.params.id;
      const objectId = this.vizTransition.targetId;
      const targetPositions = this.getDetailPositions(objectId, tagTitle);

      //preloading: collect all geometries of tag in one object as sample ids
      const object = this.$store.getters.object(objectId);
      const samples = object.tags
        .find(el => el.title === tagTitle)
        .geometry.map(geo => {
          return {
            id: getCutoutUID(objectId, tagTitle, geo.x, geo.y)
          };
        });

      this.stageSamples(loader, samples);
      this.stageDetail(loader);

      EventBus.$emit("centerWorld", durations.sampleSpreadDelay);

      loader.load(() => {
        this.createFauxDetail();

        window.setTimeout(() => {
          //Zoom viewport to fit the next view
          const frameBBox = this.$store.getters.detailFrameBBox(objectId);
          this.$store.dispatch("computeWorldSize", frameBBox);
          EventBus.$emit("zoomToWorld");

          //Spread out target VizCloudSamples
          EventBus.$emit("spreadCloudItemSamples", {
            targetId: tagTitle,
            targetPositions
          });

          //Fade-In Faux Detail
          TweenLite.to(this.fauxDetail, durations.detailFadeIn, {
            alpha: 1,
            delay: durations.sampleSpread + 0.5,
            ease: Power2.easeIn
          });

          //Route to the target view
          window.setTimeout(() => {
            this.$router.push({ path: this.vizTransition.targetPath });
          }, (durations.sampleSpread + 0.5 + durations.detailFadeIn) * 1000);
        }, durations.sampleSpreadDelay * 1000);
      });
    },

    transitionDetailToTag() {
      const loader = new PIXI.Loader();
      const objectId = this.$route.params.id;
      const tagTitle = this.vizTransition.targetId;

      this.prepareForceLayout();

      const spawnPositions = this.getDetailPositions(objectId, tagTitle);
      const largestSize = Math.max(...spawnPositions.map(el => el.size));

      //preloading: collect all geometries of this tag in this object
      const object = this.$store.getters.object(objectId);
      const samples = object.tags
        .find(el => el.title === tagTitle)
        .geometry.map(geo => {
          return {
            id: getCutoutUID(objectId, tagTitle, geo.x, geo.y)
          };
        });
      this.stageSamples(loader, samples);

      //preloading: also add first geometries of this tag in all other objects
      const tag = this.$store.getters.tag(tagTitle);
      const otherSamples = tag.occurrences
        .filter(occ => occ.origin !== objectId)
        .map(occ => {
          return {
            id: getCutoutUID(
              occ.origin,
              tagTitle,
              occ.geometry[0].x,
              occ.geometry[0].y
            )
          };
        });
      this.stageSamples(loader, otherSamples);

      loader.load(() => {
        EventBus.$emit("fadeOutDetail");

        //mount VizCloudSamples for transition animation
        this.renderStack = samples;
        //render first item on top
        const originSample = this.renderStack.shift();
        this.renderStack.push(originSample);

        //wait for vue to reflect the new renderStack
        this.$nextTick(() => {
          //centering
          EventBus.$emit("centerWorld", durations.sampleSpread);
          this.$refs.cloudsamples.forEach(cloudSample => {
            const spawnPosition = spawnPositions.find(
              el => el.id === cloudSample.id
            );

            TweenLite.fromTo(
              cloudSample.sprite,
              durations.sampleSpread,
              {
                x: spawnPosition.x,
                y: spawnPosition.y,
                width: spawnPosition.size,
                height: spawnPosition.size
              },
              {
                x: -largestSize / 2,
                y: -largestSize / 2,
                width: largestSize,
                height: largestSize,
                ease: Power2.easeInOut
              }
            );
          });

          window.setTimeout(() => {
            //now that all samples are centered, lets switch the renderStack to otherSamples
            const originSample = this.renderStack.pop();
            otherSamples.push(originSample);

            //Zoom viewport to fit the next view
            const targetBBox = this.$store.getters.cloudBBox(tagTitle);
            this.$store.dispatch("computeWorldSize", targetBBox);
            EventBus.$emit("zoomToWorld");

            //force vue to remount the VizCloudSamples
            this.renderStack = [];
            //wait for vue to reflect the new renderStack
            this.$nextTick(() => {
              this.renderStack = otherSamples;

              //wait for vue to reflect the new renderStack
              this.$nextTick(() => {
                //Spread samples
                this.$refs.cloudsamples.forEach(cloudSample => {
                  const objectId = cloudSample.id.split("-")[0];
                  const targetPosition = this.$store.getters.positionInCloud(
                    tagTitle,
                    objectId
                  );

                  TweenLite.fromTo(
                    cloudSample.sprite,
                    durations.sampleSpread,
                    {
                      x: -largestSize / 2,
                      y: -largestSize / 2,
                      width: largestSize,
                      height: largestSize
                    },
                    {
                      x: targetPosition.x,
                      y: targetPosition.y,
                      width: targetPosition.size,
                      height: targetPosition.size,
                      ease: Power2.easeInOut,
                      onComplete: () => {
                        this.$router.push({
                          path: this.vizTransition.targetPath
                        });
                      }
                    }
                  );
                });
              });
            });
          }, (durations.sampleSpread + 0.5) * 1000);
        });
      });
    },

    getDetailPositions(objectId, tagTitle) {
      const object = this.$store.getters.object(objectId);
      const detailFrameBBox = this.$store.getters.detailFrameBBox(objectId);

      //collect all geometries of tag in one object as sample ids
      return object.tags
        .find(el => el.title === tagTitle)
        .geometry.map(geo => {
          return {
            id: getCutoutUID(objectId, tagTitle, geo.x, geo.y),
            x: geo.x - detailFrameBBox.x - detailFrameBBox.width / 2,
            y: geo.y - detailFrameBBox.y - detailFrameBBox.height / 2,
            size: geo.size
          };
        });
    },

    prepareForceLayout() {
      const tagTitle = this.vizTransition.targetId;

      //only ever compute cloud layout once
      if (!this.$store.state.clouds[tagTitle]) {
        const tag = this.$store.getters.tag(tagTitle);
        const cloudItems = convertTagOccurencesToCloudItems(tag);
        this.$store.dispatch("computeForceLayout", {
          key: tagTitle,
          data: cloudItems
        });
      }
    },

    /**
     * add samples to loader for preloading
     */
    stageSamples(loader, samples) {
      samples.forEach(sample => {
        if (!PIXI.utils.TextureCache[sample.id]) {
          const origin = sample.id.split("-")[0];
          loader.add(
            sample.id,
            `${process.env.VUE_APP_URL_SAMPLE}/${origin}/${sample.id}.jpg`
          );
        }
      });
    },

    /**
     * add detail image to loader for preloading
     */
    stageDetail(loader) {
      const detailId = this.vizTransition.targetId;
      if (!PIXI.utils.TextureCache[detailId]) {
        loader.add(
          detailId,
          `${process.env.VUE_APP_URL_DETAIL}/${detailId}.jpg`
        );
      }
    },

    /**
     * fauxDetail is only visible for the fade-in, then router will go to the actual detail url
     */
    createFauxDetail() {
      const detailId = this.vizTransition.targetId;
      const object = this.$store.getters.object(detailId);
      const sprite = (this.fauxDetail = new PIXI.Sprite());
      sprite.alpha = 0;
      sprite.anchor.set(0.5);
      sprite.width = object.origWidth;
      sprite.height = object.origHeight;
      sprite.texture = PIXI.utils.TextureCache[detailId];

      //fade-in detail image
      this.vizContainer.addChild(sprite);
    },

    destroyFauxDetail() {
      if (this.fauxDetail) this.vizContainer.removeChild(this.fauxDetail);
      this.fauxDetail = null;
    }
  },
  beforeMount() {
    this.samplesContainer = new PIXI.Container();
  },
  mounted() {
    this.vizContainer.addChild(this.samplesContainer);
  },
  beforeDestroy() {
    this.destroyFauxDetail();
    this.vizContainer.removeChild(this.samplesContainer);
  }
};
</script>

<style scoped lang="scss"></style>
