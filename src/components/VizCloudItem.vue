<template>
  <div class="tag">
    <router-link :to="`/viz/tag/${item.id}`"
      >Cloud item {{ item.id }}</router-link
    >

    <VizCloudSample
      v-for="sample in renderStack"
      ref="cloudsamples"
      :id="sample.id"
      :size="position.size"
      :key="`viz-clouditem-${sample.id}`"
    />
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import { mapState } from "vuex";
import { TweenLite, Power2 } from "gsap/TweenMax";
import VizCloudSample from "./VizCloudSample.vue";
import EventBus from "../eventbus.js";
import { durations } from "../variables.js";

export default {
  name: "viz-cloud-item",
  props: {
    item: { type: Object, required: true },
    cloudname: { type: String, required: true },
    subpath: { type: String, required: true }
  },
  data: function() {
    return {
      itemContainer: null,
      samplesContainer: null,
      renderIndex: 0, //index of next appended item
      renderStack: [], //array of items that are rendered
      isHovered: false
    };
  },
  watch: {},
  components: { VizCloudSample },
  computed: {
    ...mapState(["canvas", "isDragging", "tooltip"]),
    position: function() {
      return this.$store.getters.positionInCloud(this.cloudname, this.item.id);
    }
  },
  methods: {
    appendNext() {
      //don't shuffle while hovered
      if (this.isHovered) return;

      //don't shuffle while dragging
      //@todo this should already happen in VizCloud and prevent loading in the first place
      if (this.isDragging) return;

      //if there is only one sample that is already in the renderStack, do nothing
      if (this.item.samples.length === 1 && this.renderStack.length === 1)
        return;

      //@todo bugfix - when there are only two samples, VizCloudSamples seem not to be remounted, resulting in no re-appending on PIXI level
      //console.log('hmm ...', this.item.samples.length, this.renderIndex)

      //next sample to be appended
      const nextSample = this.item.samples[this.renderIndex];

      //clone renderStack and add nextSample
      let renderStack = this.renderStack.map(d => d);
      renderStack.push(nextSample);

      //only keep last two samples
      if (renderStack.length > 2) {
        renderStack = renderStack.slice(renderStack.length - 2);
      }

      //update render stack
      this.renderStack = renderStack;
      this.renderIndex++;
      if (this.renderIndex === this.item.samples.length) this.renderIndex = 0;
    },
    fillRenderStack(callback) {
      //remember the currently visible cutout (last item in renderStack)
      const topMostSample = this.renderStack.pop();

      //empty the renderStack for one tick ... this is a hack to force Vue to re-mount
      //all VizCutoutSamples in the desired order, so that topMostSample stays on top
      //otherwise the change will not be visible on PIXI level
      this.renderStack = [];

      //wait for vue to reflect the new renderStack as VizCloudSamples
      this.$nextTick(() => {
        //put all samples in the renderStack, put topMostSample at the top again
        let renderStack = this.item.samples.map(d => d);
        renderStack.splice(renderStack.indexOf(topMostSample), 1);
        renderStack.push(topMostSample);
        this.renderStack = renderStack;

        //wait for vue to reflect the new renderStack as VizCloudSamples
        this.$nextTick(() => {
          if (callback) callback();
        });
      });
    },
    handlePointerTap() {
      if (this.$store.state.isDragging) {
        console.log("itemContainer tap canceled, seems like you are dragging");
        return;
      }
      //console.log('itemContainer tap!', this.item);

      this.$store.commit("unsetTooltip");

      //deactivate interaction, animation only from this point
      this.samplesContainer.interactive = false;
      this.samplesContainer.buttonMode = false;

      // also deactivate interaction for all other cloud items to prevent tooltip flashes during animation
      this.$parent.cloudContainer.interactiveChildren = false;

      //center the selected CloudItem
      //@todo maybe it would be nicer to move the camera to the item
      TweenLite.to(this.itemContainer, durations.sampleSpreadDelay, {
        x: -this.position.size / 2,
        y: -this.position.size / 2,
        ease: Power2.easeOut
      });

      //start the transition
      const from = this.$route.name;
      const to =
        from === "viz-overview"
          ? "viz-tag"
          : from === "viz-tag"
          ? "viz-detail"
          : "";

      this.$store.dispatch("beginVizTransition", {
        from,
        to,
        targetId: this.item.id,
        targetPath: `${this.subpath}/${this.item.id}`
      });

      //after some preparations, beginVizTransition will trigger spreadCloudItemSamples
      EventBus.$once("spreadCloudItemSamples", ({ targetPositions }) => {
        this.fillRenderStack(() => {
          //Remove offset of previous centering
          TweenLite.to(this.itemContainer, durations.sampleSpread, {
            x: 0,
            y: 0,
            ease: Power2.easeInOut
          });

          //Spread out all VizCloudSamples
          this.$refs.cloudsamples.forEach(cloudSample => {
            const newPosition = targetPositions.find(
              el => cloudSample.id.indexOf(el.id) > -1
            );
            TweenLite.to(cloudSample.sprite, durations.sampleSpread, {
              x: newPosition.x,
              y: newPosition.y,
              width: newPosition.size,
              height: newPosition.size,
              ease: Power2.easeInOut
            });
          });
        });
      }); //$once spreadCloudItemSamples
    }
  },
  beforeMount: function() {
    //console.log("hello this is a cloud item")

    // itemContainer stores samplesContainer
    const itemContainer = (this.itemContainer = new PIXI.Container());
    itemContainer.x = this.position.x;
    itemContainer.y = this.position.y;

    // samplesContainer will store all sprites from VizCloudSample.vue
    const samplesContainer = (this.samplesContainer = new PIXI.Container());
    samplesContainer.width = this.position.size;
    samplesContainer.height = this.position.size;
    itemContainer.addChild(samplesContainer);

    samplesContainer.interactive = true;
    samplesContainer.buttonMode = true;

    const pointerover = () => {
      this.isHovered = true;

      this.$store.commit("setTooltip", {
        // we first commit world coords, because camera values need to be watched and included continuously
        worldCoordinates: {
          x: this.position.x,
          y: this.position.y + this.position.size
        },
        content: {
          id: this.item.id,
          text:
            this.$route.name === "viz-overview"
              ? this.item.id
              : this.$store.getters.object(this.item.id).title,
          count: this.item.weight
        }
      });
    };

    const pointerout = () => {
      this.isHovered = false;

      // if pointerover event on another item has already fired and replaced this item in tooltip,
      // we are not unsetting the tooltip
      if (this.item.id === this.tooltip.content.id) {
        this.$store.commit("unsetTooltip");
      }
    };

    samplesContainer.on("click", this.handlePointerTap);
    samplesContainer.on("pointeover", pointerover);
    samplesContainer.on("pointerout", pointerout);

    samplesContainer.on("touchstart", e => {
      const time = Date.now() - samplesContainer.lastTapped;
      if (samplesContainer.lastTapped && time < 300 && time > 50) {
        console.log("click");
        this.handlePointerTap(e);
      } else {
        samplesContainer.lastTapped = Date.now();
        pointerover(e);
      }
    });

    samplesContainer.on("touchmove", () => {
      if (this.isDragging) pointerout();
    });
    samplesContainer.on("touchend", pointerout);
    samplesContainer.on("touchendoutside", pointerout);

    //@debug adds a sprite and random tint that will be removed on load
    /*let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size
    // add sprite
    itemContainer.addChild(sprite)*/
  },
  mounted: function() {
    this.$parent.cloudContainer.addChild(this.itemContainer);
  },
  beforeDestroy: function() {
    this.$parent.cloudContainer.removeChild(this.itemContainer);
  }
};
</script>

<style scoped lang="scss"></style>
