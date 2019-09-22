<template>
  <div class="overlay__object-info">
    <div class="box" v-if="isVisible">
      <div
        class="tab tab__tags"
        :class="metadataIsActive ? 'tab--inactive' : ''"
        @click="toggleActiveTab()"
      >
        <h3>Schlagwörter</h3>
      </div>
      <div
        class="tab tab__metadata"
        :class="metadataIsActive ? '' : 'tab--inactive'"
        @click="toggleActiveTab()"
      >
        <h3>Datenblatt</h3>
      </div>
      <div class="content">
        <transition name="fade">
          <ul
            v-show="metadataIsActive"
            class="metadata__list"
          >
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
            <li class="metadata__key" v-if="metadata.permalink">
              <a :href="metadata.permalink" target="_blank">&#8599;&nbsp;&nbsp;In Sammlung öffnen</a>
            </li>
          </ul>
        </transition>
        <transition name="fade">
          <p v-show="!metadataIsActive">
            Schlagwörter...
          </p>
        </transition>
      </div>
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
    return {
      metadataIsActive: true
    }
  },
  methods: {
    toggleActiveTab: function () {
      this.metadataIsActive = !this.metadataIsActive
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay__object-info {
  position: absolute;
  bottom: calc(var(--icon-size) + (var(--padding-outer)*2));
  right: var(--padding-outer);
  background-color: var(--color-ui-bg);
  overflow: visible;

  .box {
    width: auto;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-gap: 0;
    grid-template-areas:
      "tab-left tab-right"
      "content content";
    
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      right: calc(var(--icon-size)/2 - 0.5rem);
      width: 1rem;
      height: 1rem;
      background-color: var(--color-ui-bg);
      transform: rotate(45deg);
      transform-origin: center;
    }

    .tab {
      padding: var(--padding-outer) var(--padding-outer) calc(var(--padding-outer)/2);
      > h3 {
        margin-bottom: 0;
        &:hover {
          cursor: pointer;
        }
      }
      &.tab__tags {
        grid-area: tab-left;
        border-right: var(--border-width) solid var(--color-canvas);
      }
      &.tab__metadata {
        grid-area: tab-right;
      }
      &.tab--inactive {
        border-bottom: var(--border-width) solid var(--color-canvas);
        > h3 {
          color: var(--color-ui-secondary);
        }
      }
    }

    .content {
      grid-area: content;
      max-width: 35rem;
      padding: calc(var(--padding-outer)/2) var(--padding-outer) var(--padding-outer);
    }

    .tags__list {
      grid-area: content;
      padding: 0;
      margin: 0;
    }

    .metadata__list {
      list-style: none;
      padding: 0;
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
    }
  }
}

/* TRANSITIONS
---------------------------------- */
// TODO: build 'fade' transition
</style>
