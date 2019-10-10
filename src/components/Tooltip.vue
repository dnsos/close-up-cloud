<template>
  <div
    v-show="tooltip.isVisible"
    class="tooltip"
    :style="'top:' + tooltip.position.y + 'px;' + 'left:' + tooltip.position.x + 'px;'"
  >
    <div v-if="isView('viz-overview')">
      {{ tooltip.content.text }}&nbsp;<span class="tooltip__content--highlighted">{{ tooltip.content.count }}</span>
    </div>
    <div v-else-if="isView('viz-tag')">
      <span class="tooltip__content--highlighted">{{ tooltip.content.count }}</span>
      <span class="tooltip__content--lowercase">&nbsp;in&nbsp;</span>
      <span>{{ tooltip.content.text }}</span>
    </div>
    <div v-else-if="isView('viz-detail')">
      {{ tooltip.content.text }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tooltip',
  computed: {
    ...mapState(['viewport', 'tooltip']),
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
  pointer-events: none;

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

  .tooltip__content--lowercase {
    text-transform: none;
  }

  .tooltip__content--highlighted {
    font-weight: var(--font-weight-bold);
  }
}
</style>
