import Vue from 'vue'
import Vuex from 'vuex'

import data from './assets/data/objects-label-metadata.json'

import resources from './assets/resources.json'
import forceLayout from './js/forceLayout.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    inverted: false,
    objects: data,
    resources: resources, // points to image files with a scale factor of 0.5
    views: ['cloud', 'tag', 'detail'],
    activeView: 'cloud',
    cloud: {
      positioning: null
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
    taglist: (state) => {
      
      const uncleanedTaglist = []

      // create list of all tags
      state.objects.map((object) => {
        object.tags.map((tag) => {
          uncleanedTaglist.push(tag.title) 
        })
      })

      // create list of unique tags
      const uniqueTaglist = [...new Set(uncleanedTaglist)]
      // remove 'Frame' tag
      uniqueTaglist.splice(uniqueTaglist.indexOf('Frame'), 1)

      // loop through all unique tags
      const data = uniqueTaglist.map((tagString) => {

        // loop through all occurrences
        const occurrences = state.objects.map((object) => {

          // find tagData wherever it matches the current tagString
          const tagData = object.tags.find((tag) => {
            return tag.title === tagString 
          })

          // if 'find' returns 'null', create a 'null' geometry object
          const tagGeometry = tagData ? tagData.geometry : null

          // tagGeometry is not 'null', return the element
          if (tagGeometry != null) {
            return {
              origin: object.id,
              geometry: tagGeometry
            }
          }
          // else return nothing
          else {
            return
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

      return data
    },
    selectedTag: (state, getters) => {
      return getters.taglist.find(tag => tag.title === state.selection.tag.active)
    }
  },
  mutations: {
    toggleMode: (state) => {
      state.inverted = !state.inverted
    },
    defineForceLayout: (state, payload) => {
      state.cloud.positioning = payload
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
    handleDefineForceLayout: ({ commit }, payload) => {
      commit('defineForceLayout', forceLayout(payload))
    }
  }
})
