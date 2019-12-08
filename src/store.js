import Vue from "vue";
import Vuex from "vuex";
import forceLayout from "./forceLayout.js";
import { longStackSupport } from "q";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inverted: false, //boolean
    dataFetched: false, //boolean
    isTransitioning: false, //boolean
    data: [], //json data
    taglist: [],
    vizContainer: null, //PIXI.Container
    vizTransition: {
      from: null,
      to: null,
      targetPath: ""
    },
    camera: {
      x: 0,
      y: 0
    },
    cameraZoom: {
      zoom: 0.1, //current zoom
      center: { x: 0, y: 0 } //zoom center (screen coords)
    },
    cameraMinZoom: 0.1,
    cursor: {
      x: 0,
      y: 0
    },
    isDragging: false,
    canvas: {
      width: 1280,
      height: 800
    },
    world: {
      width: 1280,
      height: 800
    },
    PIXIApp: null,
    renderer: null,
    clouds: {},
    tooltip: {
      isVisible: false,
      worldCoordinates: {
        x: 0,
        y: 0
      },
      content: {
        id: "",
        text: "",
        count: null
      }
    },
    isTouchDevice: false,
    isMkg: false,
    lastTouchedId: null,
    logbuffer: [],
    logId: Date.now()
  },
  getters: {
    tag: state => title => {
      return state.taglist.find(tag => tag.title === title);
    },
    object: state => objectID => {
      return state.data.find(object => object.id === objectID);
    },
    totalNumberOfCloseups: state => {
      let counter = 0;
      state.data.map(object => {
        object.tags.map(tag => {
          if (tag.title === "Frame") return; // do not count closeups that represent the main frame
          counter += tag.geometry.length;
        });
      });
      return counter;
    },
    /*maxTagCount: (state) => (title) => {
      return Math.max( ...state.taglist.map(tag => tag.tagCount))
    },*/
    cloud: state => cloud => {
      if (!state.clouds[cloud])
        throw new Error(`there is no cloud named ${cloud}`);
      return state.clouds[cloud];
    },
    cloudBBox: state => cloud => {
      if (!state.clouds[cloud])
        throw new Error(`there is no cloud named ${cloud}`);
      const c = state.clouds[cloud],
        x = Math.min(...c.map(d => d.x)),
        y = Math.min(...c.map(d => d.y)),
        w = Math.max(...c.map(d => d.x + d.size)),
        h = Math.max(...c.map(d => d.y + d.size));

      return {
        x: x,
        y: y,
        width: Math.abs(x - w),
        height: Math.abs(y - h)
      };
    },
    positionInCloud: state => (cloud, id) => {
      if (!state.clouds[cloud])
        throw new Error(`there is no cloud named ${cloud}`);
      return state.clouds[cloud].find(el => el.id === id);
    },
    detailFrameBBox: (state, getters) => objectId => {
      const object = getters.object(objectId);
      const frame = object.tags.find(tag => tag.title === "Frame");
      return frame.geometry[0];
    },
    worldToScreen: state => ({ x, y }) => {
      x *= state.cameraZoom.zoom;
      y *= state.cameraZoom.zoom;
      x += state.canvas.width / 2;
      y += state.canvas.height / 2;
      x += state.camera.x;
      y += state.camera.y;
      return { x, y };
    },
    screenToWorld: state => ({ x, y }) => {
      x -= state.canvas.width / 2;
      y -= state.canvas.height / 2;
      x -= state.camera.x;
      y -= state.camera.y;
      return {
        x: x / state.cameraZoom.zoom,
        y: y / state.cameraZoom.zoom
      };
    }
  },
  mutations: {
    setData: (state, data) => {
      state.data = data;
    },
    setDataFetched: state => {
      state.dataFetched = true;
    },
    setPIXIApp: (state, payload) => {
      state.PIXIApp = payload;
    },
    setCamera: (state, payload) => {
      if (!state.isTransitioning) {
        //constrain the the cameras pixel offset from center
        const constrains = {
          x: Math.abs(
            (state.world.width / 2) * state.cameraZoom.zoom -
              state.canvas.width / 2
          ),
          y: Math.abs(
            (state.world.height / 2) * state.cameraZoom.zoom -
              state.canvas.height / 2
          )
        };
        if (payload.x < -constrains.x) payload.x = -constrains.x;
        if (payload.x > constrains.x) payload.x = constrains.x;
        if (payload.y < -constrains.y) payload.y = -constrains.y;
        if (payload.y > constrains.y) payload.y = constrains.y;
      }

      state.camera = payload;
    },
    setCameraZoom: (state, payload) => {
      state.cameraZoom = payload;
    },
    setCameraMinZoom: (state, payload) => {
      state.cameraMinZoom = payload;
    },
    setVizContainer: (state, payload) => {
      state.vizContainer = payload;
    },
    setWorld: (state, payload) => {
      state.world = payload;
    },
    isTransitioning: (state, payload) => {
      state.isTransitioning = payload;
    },
    toggleColors: state => {
      state.inverted = !state.inverted;
    },
    setBrightColors: state => {
      state.inverted = false;
    },
    setTooltip: (state, payload) => {
      state.tooltip.isVisible = true;
      state.tooltip.worldCoordinates = payload.worldCoordinates;
      state.tooltip.content = payload.content;
    },
    unsetTooltip: state => {
      state.tooltip.isVisible = false;
      // TODO: negative implications of not resetting content and coordinates?
    },
    dragStart: state => {
      console.log("dragStart");
      state.isDragging = true;
      // state.lastTouchedId = false;
    },
    dragEnd: state => {
      console.log("dragENd");
      state.isDragging = false;
    },
    cursor: (state, payload) => {
      state.cursor = payload;
    },
    setForceLayout: (state, payload) => {
      state.clouds[payload.key] = payload.data;
    },
    updateCanvasSize: (state, payload) => {
      state.canvas = payload;
    },
    setVizTransition: (state, payload) => {
      state.vizTransition = payload;
    },
    buildTaglist: state => {
      const uncleanedTaglist = [];

      // create list of all tags
      state.data.map(object => {
        object.tags.map(tag => {
          uncleanedTaglist.push(tag.title);
        });
      });

      // create list of unique tags
      const uniqueTaglist = [...new Set(uncleanedTaglist)];
      // remove 'Frame' tag
      uniqueTaglist.splice(uniqueTaglist.indexOf("Frame"), 1);

      // loop through all unique tags
      state.taglist = uniqueTaglist.map(tagString => {
        // loop through all occurrences
        const occurrences = state.data.map(object => {
          // find tagData wherever it matches the current tagString
          const tagData = object.tags.find(tag => tag.title === tagString);

          if (!tagData) return;

          return {
            origin: object.id,
            geometry: tagData.geometry
          };
        });

        // filter occurrences that are defined
        const filteredOccurrences = occurrences.filter(occurence => {
          return occurence != undefined;
        });

        // count total occurrences of each tag
        const tagCount = filteredOccurrences.map(occurence => {
          let counter = 0;
          counter += occurence.geometry.length;
          return counter;
        });

        // return object with all relevant data
        return {
          title: tagString,
          occurrences: filteredOccurrences,
          objectCount: filteredOccurrences.length, // counter for occurrences in objects
          tagCount: tagCount.reduce(
            (accumulator, currentValue) => accumulator + currentValue
          ) // sum up tagCount
        };
      });

      console.log("built taglist:", state.taglist);
    }
  },
  actions: {
    updateCanvasSize: ({ commit }, payload) => {
      commit("updateCanvasSize", payload);
    },
    beginVizTransition: ({ commit }, payload) => {
      commit("setVizTransition", payload);
      commit("isTransitioning", true);
    },
    endVizTransition: ({ commit }) => {
      commit("isTransitioning", false);
    },
    computeForceLayout({ commit, state }, payload) {
      //console.log('computeForceLayout:', payload);
      commit("setForceLayout", {
        key: payload.key,
        data: forceLayout(payload.data, {
          canvasWidth: state.canvas.width,
          canvasHeight: state.canvas.height
        })
      });
    },
    computeWorldSize({ commit, state }, payload) {
      let { width, height } = payload;

      //min world size: canvas
      width = Math.max(width, state.canvas.width);
      height = Math.max(height, state.canvas.height);

      //adapt world to canvas size to prevent zoom jitter
      //@todo for super responsiveness world should update on resize
      const canvasRatio = state.canvas.width / state.canvas.height;
      if (canvasRatio > 1) {
        width = height * canvasRatio;
      } else {
        height = width * canvasRatio;
      }

      //make world*1.25 to enable some panning
      width *= 1.25;
      height *= 1.25;

      commit("setWorld", {
        width: width,
        height: height
      });
    },
    log({ state, dispatch }, payload) {
      const row = state.logId + ',"' + payload.join('","') + '"';
      state.logbuffer.push(row);
      // console.log("log", row);
      if (state.logbuffer.length >= 10) {
        dispatch("sendLogs");
      }
    },
    async sendLogs({ state }) {
      if (state.logbuffer.length === 0) return;
      const payload = state.logbuffer.join("\n") + "\n";
      // console.log("sendLogs", payload);
      state.logbuffer = [];
      return await fetch(
        "https://uclab.fh-potsdam.de/closeupcloud/log/log.php",
        {
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    },
    async fetchData({ commit }) {
      const url = process.env.VUE_APP_URL_DATA;
      console.log(`fetching ${url} ...`);

      return (
        window
          .fetch(url)
          .then(response => response.json())

          //@debug check for duplicate ids
          .then(data => {
            const dataIds = [];
            data.forEach(d => {
              if (dataIds.indexOf(d.id) > -1)
                console.error("Data Integrity Error: Duplicate ID", d.id);
              dataIds.push(d.id);
            });
            return data;
          })

          .then(data => {
            console.log("data fetched", data);
            commit("setData", data);
            commit("buildTaglist");
            return data;
          })
          .catch(error => {
            console.error("Fetch Data Error", error);
          })
      );
    }
  }
});
