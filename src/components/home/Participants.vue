<template>
  <section class="home__section">
    <div class="section__wrapper grid-12-columns">
      <h2 class="participants__heading">Beteiligte</h2>
      <p class="participants__scope">Ein studentisches Forschungsprojekt der <a href="https://www.fh-potsdam.de/" target="_blank">Fachhochschule Potsdam</a> in Kooperation mit dem <a href="https://www.mkg-hamburg.de/de/home.html" target="_blank">Museum für Kunst und Gewerbe Hamburg</a> gefördert vom <a href="http://www.zem-brandenburg.de/" target="_blank">Brandenburgischen Zentrum für Medienwissenschaften</a>.</p>
      <div class="participants__core">
        <ul class="participants-list">
          <li v-for="participant in participants.core" :key="participant.name">
            <span class="participant__name">{{participant.name}}</span>
            <span class="participant__role">{{participant.role}}</span>
          </li>
        </ul>
      </div>
      <div class="participants__extended">
        <ul class="participants-list">
          <li v-for="participant in participants.extended" :key="participant.name">
            <span class="participant__name">{{participant.name}}</span>
            <span class="participant__role">{{participant.role}}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'participants',
  data: function () {
    return {
      scope: null, /* non-priority TODO: grab text from external markdown file */
      participants: {
        core: [
          {
            name: 'Pauline Junginger',
            role: 'Konzeption, Theoriearbeit, Dokumentation'
          },
          {
            name: 'Dennis Ostendorf',
            role: 'Konzeption, Gestaltung, Entwicklung'
          },
          {
            name: 'Anastasia Voloshina',
            role: 'Konzeption, Gestaltung, Video'
          },
          {
            name: 'Barbara Avila Vissirini',
            role: 'Konzeption, Gestaltung, Erschließung'
          },
        ],
        extended: [
          {
            name: 'Timo Hausmann',
            role: 'Software-Entwicklung Web'
          },
          {
            name: 'Christopher Pietsch',
            role: 'Software-Entwicklung Ausstellung'
          },
          {
            name: 'Sarah Kreiseler',
            role: 'Kunstwissenschaftliche Betreuung'
          },
          {
            name: 'Prof. Dr. Marian Dörk',
            role: 'Wissenschaftliche Leitung'
          },
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.participants__heading {
  grid-column: 1 / 13;
  margin-bottom: 0;
}

.participants__scope {
  font-size: var(--font-size-small);
	margin-top: 0.25em;
}

@media screen and (max-width: 750px) {
  .participants__scope {
    grid-column: 1 / 9;
  }
  .participants__core {
    grid-column: 1 / 7;
  }
  .participants__extended {
    grid-column: 7 / 13;
  }
}
@media screen and (min-width: 750px) {
  .participants__scope {
    grid-column: 1 / 4;
  }
  .participants__core {
    grid-column: 5 / 9;
  }
  .participants__extended {
    grid-column: 9 / 13;
  }
}

.participants-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: calc(var(--grid-spacing)/2);

    .participant__name, .participant__role {
      display: block;
    }
    .participant__role {
      font-size: var(--font-size-small);
    }
  }
}
</style>
