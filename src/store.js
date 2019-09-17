import Vue from 'vue'
import Vuex from 'vuex'
import forceLayout from './forceLayout.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    inverted: false,
    isLoading: false,
    data: [], //original data
    taglist: [],
    input: {
      isDragging: false,
      maxZoomFactor: 20
    },
    canvas: {
      width: 1280,
      height: 800
    },
    PIXIApp: null,
    viewport: null,
    clouds: {}
  },
  getters: {
    tag: (state) => (title) => {
      return state.taglist.find(tag => tag.title === title)
    },
    object: (state) => (objectID) => {
      return state.data.find(object => object.id === objectID)
    },
    /*maxTagCount: (state) => (title) => {
      return Math.max( ...state.taglist.map(tag => tag.tagCount))
    },*/
    cloud: (state) => (cloud) => {
      if(!state.clouds[cloud]) throw new Error(`there is no cloud named ${cloud}`)
      return state.clouds[cloud];
    },
    viewportZoom: (state) => (geometry) => {

      let ratio = 1;
      const padding = 120;

      //@todo pay respect both width and height
      ratio = ((state.canvas.height-padding) / geometry.height)
      return ratio;
    },
    cloudBBox: (state) => (cloud) => {
      if(!state.clouds[cloud]) throw new Error(`there is no cloud named ${cloud}`)
      const c = state.clouds[cloud],
      x = Math.min(...c.map(d => d.x)),
      y = Math.min(...c.map(d => d.y)),
      w = Math.max(...c.map(d => d.x+d.size)),
      h = Math.max(...c.map(d => d.y+d.size));

      return {
        x: x,
        y: y,
        width: Math.abs(x - w),
        height: Math.abs(y - h) 
      }
    },
    positionInCloud: (state) => (cloud, id) => {
      if(!state.clouds[cloud]) throw new Error(`there is no cloud named ${cloud}`)
      return state.clouds[cloud].find(el => el.id === id)
    },
  },
  mutations: {
    setData: (state, data) => {
      state.data = data
    },
    setPIXIApp: (state, payload) => {
      state.PIXIApp = payload
    },
    setViewport: (state, payload) => {
      state.viewport = payload
    },
    toggleColors: (state) => {
      state.inverted = !state.inverted
    },
    dragStart: (state) => {
      state.isDragging = true
    },
    dragEnd: (state) => {
      state.isDragging = false
    },
    setForceLayout: (state, payload) => {
      //console.log('setForceLayout:', payload);
      state.clouds[payload.key] = payload.data
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
    updateCanvasSize: ({ commit }, payload) => {
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
      
      const url = process.env.VUE_APP_URL_DATA;
      console.log(`fetching ${url} ...`);
      
      return window.fetch(url)
        .then(response => response.json())

        //@debug check for duplicate ids
        .then(data => {
          const dataIds = [];
          data.forEach(d => {
            if(dataIds.indexOf(d.id) > -1) console.error('Data Integrity Error: Duplicate ID', d.id);
            dataIds.push(d.id);
          })
          return data;
        })
        
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