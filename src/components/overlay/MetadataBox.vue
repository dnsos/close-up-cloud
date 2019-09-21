<template>
  <div class="overlay__metadata">
    <div class="metadata" v-if="isVisible">
      <h3 class="heading__tags">Schlagwörter</h3>
      <h3 class="heading__metadata">Datenblatt</h3>
      <ul class="metadata__list">
        <li class="metadata__item">
          <span class="metadata__key">Titel</span><br>
          <span class="metadata__value">{{metadata.title}}</span>
        </li>
        <li class="metadata__item">
          <span class="metadata__key">Fotograf</span><br>
          <span class="metadata__value">Wilhelm Weimar</span>
        </li>
        <li class="metadata__item">
          <span class="metadata__key">Herstellung</span><br>
          {{metadata.date}}&nbsp;in&nbsp;{{metadata.location}}
        </li>
        <li class="metadata__key metadata--highlighted" v-if="metadata.permalink">
          <a :href="metadata.permalink" target="_blank">&#8599;&nbsp;&nbsp;In Sammlung öffnen</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'metadata',
  props: {
    metadata: {
      type: Object,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.overlay__metadata {
  position: absolute;
  bottom: calc(var(--icon-size) + (var(--padding-outer)*2));
  right: var(--padding-outer);
  background-color: var(--color-ui-bg);
  overflow: hidden;

  .metadata {
    width: 30rem;
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "heading-left heading-right"
      "content content";

    h3 {
      padding: calc(var(--grid-spacing)/2) var(--grid-spacing);
      margin: 0;
    }

    .heading__tags {
      grid-area: heading-left;
    }

    .heading__metadata {
      grid-area: heading-right;
    }

    .tags__list {
      grid-area: content;
      padding: calc(var(--grid-spacing)/2) var(--grid-spacing);
    }

    .metadata__list {
      grid-area: content;
      list-style: none;
      padding: calc(var(--grid-spacing)/2) var(--grid-spacing);
      margin: 0;

      .metadata__item {
        margin-bottom: calc(var(--grid-spacing)/2);
      }

      .metadata__key {
        text-transform: uppercase;
        letter-spacing: 0.05rem;
        color: var(--color-ui-secondary);
      }

      .metadata__value {
        color: var(--color-ui-primary);
      }

      .metadata--highlighted {
        color: var(--color-ui-highlighted);
      }
    }
  }
}
</style>
