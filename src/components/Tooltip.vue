<template>
  <div
    v-if="tooltip.isVisible"
    class="tooltip"
    :style="'top:' + tooltip.coordinates.y + 'px;' + 'left:' + tooltip.coordinates.x + 'px;'"
  >
    <div v-if="isView('viz-overview')">
      {{tooltip.content.overview.text}}&nbsp;<span class="tooltip__content--highlighted">{{tooltip.content.overview.count}}</span>
    </div>
    <div v-else-if="isView('viz-tag')">
      <span class="tooltip__content--highlighted">{{tooltip.content.tag.count}}</span>&nbsp;in&nbsp;{{tooltip.content.tag.text}}
    </div>
    <div v-else-if="isView('viz-detail')">
      {{tooltip.content.detail.text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'tooltip',
  computed: {
    tooltip: function () {
      return this.$store.state.tooltip
    }
  },
  methods: {
    isView: function (route) {
      return this.$route.name === route
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  position: absolute;
  padding: calc(var(--grid-spacing)/4);
  color: var(--color-ui-highlighted);
  background-color: var(--color-ui-bg);
  text-transform: uppercase;
  letter-spacing: .05rem;

  &::before {
    position: absolute;
    top: -.5rem;
    content: '';
    width: 1rem;
    height: 1rem;
    background-color: var(--color-ui-bg);
    transform: rotate(45deg);
    transform-origin: center;
  }

  .tooltip__content--highlighted {
    font-weight: var(--font-weight-bold);
  }
}
</style>
