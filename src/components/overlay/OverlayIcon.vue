<template>
  <div class="overlay-icon" :class="iconPosition">
    <div
      class="icon button"
      @mouseover="toggleTooltipVisibility()"
      @mouseleave="toggleTooltipVisibility()"
    >
      <img :src="iconFile" :alt="tooltip.title" class="filter-invert" />
    </div>
    <div v-if="tooltip">
      <transition :name="tooltip.side === 'right' ? 'fade-slide-right' : 'fade-slide-left'">
        <div v-show="tooltipIsVisible" :class="tooltipClass">
          <span>{{ tooltip.title }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "overlay-icon",
  props: {
    position: {
      type: String,
      required: true
    },
    tooltip: {
      type: Object,
      required: false
    },
    iconFileName: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      tooltipIsVisible: false
    };
  },
  computed: {
    iconPosition: function() {
      return {
        "bottom-left": this.position === "bottom-left",
        "bottom-right": this.position === "bottom-right",
        "top-right": this.position === "top-right"
      };
    },
    tooltipClass: function() {
      return {
        tooltip: true,
        "tooltip-right": this.tooltip.side === "right",
        "tooltip-left": this.tooltip.side === "left"
      };
    },
    iconFile: function() {
      return `${process.env.VUE_APP_URL_ICONS}/${this.iconFileName}`;
    }
  },
  methods: {
    toggleTooltipVisibility: function() {
      this.tooltipIsVisible = !this.tooltipIsVisible;
      this.$store.dispatch("log", ["invert", this.tooltipIsVisible]);
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay-icon {
  position: absolute;
  width: var(--icon-size);
  height: var(--icon-size);

  &.bottom-left {
    bottom: var(--padding-outer);
    left: var(--padding-outer);
  }
  &.bottom-right {
    bottom: var(--padding-outer);
    right: var(--padding-outer);
  }
  &.top-right {
    top: var(--padding-outer);
    right: var(--padding-outer);
  }

  .icon {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--icon-size);
    height: var(--icon-size);
    padding: 0;
    background-color: var(--color-ui-bg);

    img {
      pointer-events: none;
    }
  }
  .tooltip {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: var(--icon-size);
    padding: 0 calc(var(--icon-size) / 2);
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--color-ui-primary);
    background-color: var(--color-ui-bg);

    &.tooltip-right {
      left: calc(var(--icon-size) + var(--padding-outer));

      &::before {
        position: absolute;
        top: 1.375rem;
        left: -0.5rem;
        content: "";
        width: 1rem;
        height: 1rem;
        background-color: var(--color-ui-bg);
        transform: rotate(45deg);
        transform-origin: center;
      }
    }
    &.tooltip-left {
      right: calc(var(--icon-size) + var(--padding-outer));

      &::after {
        position: absolute;
        top: 1.375rem;
        right: -0.5rem;
        content: "";
        width: 1rem;
        height: 1rem;
        background-color: var(--color-ui-bg);
        transform: rotate(45deg);
        transform-origin: center;
      }
    }
  }
}

/* TRANSITIONS
---------------------------------- */
.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
  transition: transform 0.2s;
}
.fade-slide-right-enter,
.fade-slide-right-leave-to {
  opacity: 0;
  transform: translateX(-0.5rem);
}
.fade-slide-left-enter-active,
.fade-slide-left-leave-active {
  transition: transform 0.2s;
}
.fade-slide-left-enter,
.fade-slide-left-leave-to {
  opacity: 0;
  transform: translateX(0.5rem);
}
</style>
