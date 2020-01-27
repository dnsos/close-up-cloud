<template>
  <section class="home__section">
    <div class="section__wrapper">
      <ul class="partners-list grid-12-columns">
        <li
          v-for="partner in partners"
          :key="partner.name"
          class="partner"
        >
					<a :href="`${partner.url}`">
          <img
            class="partner__logo"
            :class="`partner__${partner.abbreviation}`"
            :src="getLogoPath(partner.filename)"
            :alt="`${partner.name} Logo`"
          ></a>
        </li>
      </ul>
      <div class="imprint">
				<a style="float: left;" href="https://github.com/dnsos/close-up-cloud/" target="_blank">Quellcode</a>				
        <a href="https://www.fh-potsdam.de/impressum/" target="_blank">Impressum</a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'credits-footer',
  data: function () {
    return {
      partners: [
        {
          name: 'FH Potsdam',
					url: 'https://www.fh-potsdam.de/',
          abbreviation: 'FHP',
          filename: 'FHP_Logo.svg'
        },
        {
          name: 'Urban Complexity Lab',
					url: 'https://uclab.fh-potsdam.de',
          abbreviation: 'UCLAB',
          filename: 'UCLAB_Logo.svg'
        },
        {
          name: 'Museum für Kunst und Gewerbe Hamburg',
					url: 'https://www.mkg-hamburg.de',
          abbreviation: 'MKG',
          filename: 'MKG_Logo.svg'
        },
        {
          name: 'Brandenburgisches Zentrum für Medienwissenschaften',
					url: 'http://www.zem-brandenburg.de',
          abbreviation: 'ZeM',
          filename: 'ZEM_Logo.jpg'
        }
      ]
    }
  },
  methods: {
    getLogoPath: function (filename) {
      return `${process.env.VUE_APP_URL_LOGOS}/${filename}`
    }
  }
}
</script>

<style scoped lang="scss">
.partners-list {
  padding: calc(var(--grid-spacing)*2) 0 calc(var(--grid-spacing)*2);
  margin: 0;
  border-top: var(--border-solid);
  border-bottom: var(--border-solid);
  list-style: none;

  .partner {
    display: flex;
    justify-content: center;
    align-items: center;

    .partner__logo {
      width: 100%;
      &.partner__FHP { width: 85%; }
      &.partner__UCLAB { width: 70%; margin-left: 1.5em;}
    }
  }

  @media screen and (max-width: 750px) {
    .partner {
      grid-column: span 6;
    }
  }
  @media screen and (min-width: 750px) {
    .partner {
      grid-column: span 3;
    }
  }
}

.imprint {
  width: 100%;
  padding: var(--grid-spacing) 0 var(--grid-spacing);
  text-align: right;
}
</style>
