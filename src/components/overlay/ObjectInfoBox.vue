<template>
  <div class="object-info">
    <div class="object-info__wrapper" v-if="isVisible">
      <div
        class="tab tab__tags"
        :class="metadataIsActive ? 'tab--inactive' : ''"
        @click="metadataIsActive = false"
      >
        <h3>Schlagwörter</h3>
      </div>
      <div
        class="tab tab__metadata"
        :class="metadataIsActive ? '' : 'tab--inactive'"
        @click="metadataIsActive = true"
      >
        <h3>Datenblatt</h3>
      </div>
      <div class="content">
        <transition name="fade">
          <div v-show="!metadataIsActive">
            <ul>
              <li
                v-for="tag in filteredTags"
                :key="tag.title"
                class="tag__item"
              >
                {{ tag.title }}&nbsp;&nbsp;<span class="tag-count">{{ tag.geometry.length }}</span>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="fade">
          <ul
            v-show="metadataIsActive"
          >
            <li>
              <span class="metadata__key">Titel</span><br>
              <span class="metadata__value">{{objectInfo.title}}</span>
            </li>
            <li>
              <span class="metadata__key">Fotograf</span><br>
              <span class="metadata__value">Wilhelm Weimar</span>
            </li>
            <li>
              <span class="metadata__key">Herstellung</span><br>
              {{objectInfo.date}}&nbsp;in&nbsp;{{objectInfo.location}}
            </li>
            <li class="metadata__key" v-if="objectInfo.permalink">
              <a :href="objectInfo.permalink" target="_blank">&#8599;&nbsp;&nbsp;In Sammlung öffnen</a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'object-info-box',
  props: {
    objectInfo: {
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
      metadataIsActive: false
    }
  },
  computed: {
    filteredTags: function () {
      return this.objectInfo.tags.filter(tag => tag.title != 'Frame')
    }
  }
}
</script>

<style lang="scss" scoped>
/* WRAPPER ELEMENTS
---------------------------------- */
.object-info {
  position: absolute;
  bottom: calc(var(--icon-size) + (var(--padding-outer)*2));
  right: var(--padding-outer);
  background-color: var(--color-ui-bg);
  overflow: visible;

  .object-info__wrapper {
    width: auto;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-gap: 0;
    grid-template-areas:
      "tab-left tab-right"
      "content content";
    
    /* TRIANGLE ARROW
    ---------------------------------- */
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

    /* TABS
    ---------------------------------- */
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

    /* CONTENT AREA
    ---------------------------------- */
    .content {
      grid-area: content;
      max-width: 35rem;
      padding: calc(var(--padding-outer)/2) var(--padding-outer) var(--padding-outer);

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: calc(var(--grid-spacing)/2);
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    /* TAGS LIST
    ---------------------------------- */
    .tag__item {
      text-transform: uppercase;
      letter-spacing: .05rem;
      color: var(--color-ui-highlighted);

      .tag-count {
        font-weight: var(--font-weight-bold);
        color: var(--color-ui-highlighted);
      }
    }

    /* METADATA LIST
    ---------------------------------- */
    .metadata__key {
      text-transform: uppercase;
      letter-spacing: .05rem;
      color: var(--color-ui-secondary);
    }

    .metadata__value {
      color: var(--color-ui-primary);
    }
  }
}

/* TRANSITIONS
---------------------------------- */
// TODO: build 'fade' transition
</style>
