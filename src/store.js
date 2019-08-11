import Vue from 'vue'
import Vuex from 'vuex'
import { publicDataUrl } from './js/variables'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    inverted: false,
    views: ['cloud', 'tag', 'detail'], //viz views
    activeView: 'cloud',
    data: [],
    taglist: [],
    clouds: {   
      overview: null
    },
    selection: {
      tag: {
        hovered: '',
        active: ''
      },
      object: {
        hovered: '',
        active: ''
      }
    },
    canvas: {
      width: 0,
      height: 0
    },
    helpers: {
      renderCloseups: false
    }
  },
  getters: {
    tag: (state) => (title) => {
      return state.taglist.find(tag => tag.title === title)
    },
    taglist: (state) => {
      return state.taglist;
    },
    selectedTag: (state, getters) => {
      return getters.taglist.find(tag => tag.title === state.selection.tag.active)
    }
  },
  mutations: {

    setData: (state, data) => {
      state.data = data
    },

    toggleMode: (state) => {
      state.inverted = !state.inverted
    },
    /*defineForceLayout: (state, payload) => {
      //console.log('computeForceLayout layout:', payload);
      state.cloud.positioning = payload
    },*/
    setActiveTag: (state, payload) => {
      state.selection.tag.active = payload
    },
    setHoveredTag: (state, payload) => {
      state.selection.tag.hovered = payload
    },
    setActiveObject: (state, payload) => {
      state.selection.object.active = payload
    },
    setView: (state, payload) => {
      state.activeView = payload
    },
    updateCanvasSize: (state, payload) => {
      state.canvas = payload
    },

    buildTaglist: (state, payload) => {
      
      const uncleanedTaglist = []

      // create list of all tags
      state.data.map((object) => {
        object.tags.map((tag) => {
          uncleanedTaglist.push(tag.title) 
        })
      })

      // create list of unique tags
      const uniqueTaglist = [...new Set(uncleanedTaglist)]
      // remove 'Frame' tag
      uniqueTaglist.splice(uniqueTaglist.indexOf('Frame'), 1)

      // loop through all unique tags
      state.taglist = uniqueTaglist.map((tagString) => {

        // loop through all occurrences
        const occurrences = state.data.map((object) => {

          // find tagData wherever it matches the current tagString
          const tagData = object.tags.find((tag) => {
            return tag.title === tagString 
          })

          if(!tagData) return;
          
          return {
              origin: object.id,
              geometry: tagData.geometry
          }
        })

        // filter occurrences that are defined
        const filteredOccurrences = occurrences.filter((occurence) => {
          return occurence != undefined
        })

        // count total occurrences of each tag
        const tagCount = filteredOccurrences.map((occurence) => {
          let counter = 0
          counter += occurence.geometry.length
          return counter
        })

        // return object with all relevant data
        return {
          title: tagString,
          occurrences: filteredOccurrences,
          objectCount: filteredOccurrences.length, // counter for occurrences in objects
          tagCount: tagCount.reduce((accumulator, currentValue) => accumulator + currentValue) // sum up tagCount
        }
      })
    }
  },
  actions: {
    handleSetActiveTag: ({ commit }, payload) => {
      commit('setActiveTag', payload)
    },
    handleSetActiveObject: ({ commit }, payload) => {
      commit('setActiveObject', payload)
    },
    handleSetView: ({ commit }, payload) => {
      commit('setView', payload)
    },
    /*computeForceLayout({ commit }, payload) {
      //console.log('computeForceLayout taglist:', payload);
      commit('computeForceLayout', forceLayout(payload))
    }*/

    async fetchData({dispatch, commit}) {

      console.log(`fetching ${publicDataUrl} ...`);

      return window.fetch(publicDataUrl)
        .then(response => response.json())
        .then(data => {
          commit('setData', data);
          commit('buildTaglist');

          return data;
        })
        .catch((error) => {
            console.error('Fetch Data Error', arguments);
        })
    }
  }
})
