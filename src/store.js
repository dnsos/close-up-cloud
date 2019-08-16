import Vue from 'vue'
import Vuex from 'vuex'
import forceLayout from './js/forceLayout.js';
import { publicDataUrl } from './js/variables'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    inverted: false,
    views: ['overview', 'tag', 'detail'], //viz views
    activeView: '',
    data: [],
    taglist: [],
    PIXIApp: null,
    clouds: {   
      overview: null
    },
    selection: {
      tag: {
        hovered: null,
        active: null
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
    cloud: (state) => (cloud) => {
      if(!state.clouds[cloud]) throw new Error(`there is no cloud named ${cloud}`)
      return state.clouds[cloud];
    },
    findOccurenceInActiveTag: (state) => (objectID) => {
      return state.selection.tag.active.occurrences.find(occurrence => occurrence.origin === objectID)
    },
    positionInCloud: (state) => (cloud, id) => {
      if(!state.clouds[cloud]) throw new Error(`there is no cloud named ${cloud}`)
      return state.clouds[cloud].find(el => el.id === id)
    },
    object: (state) => (objectID) => {
      return state.data.find(object => object.id === objectID)
    }
  },
  mutations: {
    setData: (state, data) => {
      state.data = data
    },
    setPIXIApp: (state, payload) => {
      state.PIXIApp = payload
    },
    toggleMode: (state) => {
      state.inverted = !state.inverted
    },
    setForceLayout: (state, payload) => {
      console.log('setForceLayout:', payload);
      state.clouds[payload.key] = payload.data
    },
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
    buildTaglist: (state) => {
      
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
          const tagData = object.tags.find(tag => tag.title === tagString)

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

      console.log('built taglist:', state.taglist);
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
    updateCanvasSize: ({ commit, state }, payload) => {
      state.PIXIApp.renderer.resize(payload.width, payload.height);
      state.PIXIApp.stage.x = payload.width/2;
      state.PIXIApp.stage.y = payload.height/2;
      commit('updateCanvasSize', payload)
    },
    computeForceLayout({ commit, state }, payload) {
      console.log('computeForceLayout:', payload);
      commit('setForceLayout', {
        key: payload.key,
        data: forceLayout(payload.data, {
          canvasWidth: state.canvas.width,
          canvasHeight: state.canvas.height
        })
      })
    },
    async fetchData({commit}) {
      console.log(`fetching ${publicDataUrl} ...`);
      return window.fetch(publicDataUrl)
        .then(response => response.json())
        .then(data => {
          console.log("data fetched", data)
          commit('setData', data);
          commit('buildTaglist');
          return data;
        })
        .catch((error) => {
            console.error('Fetch Data Error', error);
        })
    }
  }
})