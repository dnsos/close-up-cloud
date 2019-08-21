<template>
  <div class="overlay__objectdata">
    <div class="objectdata" v-if="isOpened">
      <ul class="list">
        <li class="list-item">
          <span class="highlighted">Fotograf</span><br>
          Wilhelm Weimar
        </li>
        <li class="list-item">
          <span class="highlighted">Herstellung</span><br>
          {{objectdata.date}}&nbsp;in&nbsp;{{objectdata.location}}
        </li>
        <li class="list-item">
          <button>→ In Sammlung öffnen</button>
        </li>
      </ul>
    </div>
    <div class="toggle__objectdata">
      <button @click="toggleOpened()">Objektdaten</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'object-data',
  props: {
    objectID: { type: String, required: true }
  },
  data: function () {
    return {
      isOpened: false
    }
  },
  computed: {
    objectdata: function () {
      return this.$store.getters.object(this.objectID)
    }
  },
  methods: {
    toggleOpened: function () {
      this.isOpened = !this.isOpened
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay__objectdata {
  position: absolute;
  bottom: 0;
  right: 0;
  color: var(--color-primary-100);
  background-color: var(--color-primary-0);
  transition: color 2s ease-in-out, background-color 2s ease-in-out;

  .objectdata {
    width: 25rem;
    text-align: left;

    .list {
      list-style: none;
      padding: var(--grid-spacing);
      margin: 0;

      .list-item {
        margin-bottom: calc(var(--grid-spacing)/2);
      }

      .highlighted {
        text-transform: uppercase;
        color: var(--color-primary-50);
        font-size: var(--font-size-small);
      }
    }
  }

  .toggle__objectdata {
    text-align: right;
  }
}
</style>
