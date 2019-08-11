import store from '../store'
import { getRandomInt } from './utils'
import { mockupSettings, durations } from './variables'
import { scaleLinear } from 'd3'
import { TimelineMax } from 'gsap/TweenMax'
import { Rectangle } from 'pixi.js';
import { getOccurrenceUID } from '../js/utils.js'

export function spreadSelectedTag (tagContainer) {

  // hide tag title for events
  const tagTitle = tagContainer.children.find(child => child.name === 'textBox')
  tagTitle.visible = false

  //center container
  tagContainer.x = 0;
  tagContainer.y = 0;

  // reference container with occurrences
  const occurrencesContainer = tagContainer.children.find(child => child.name === 'occurrencesContainer')

  // assign an image texture to each occurrenceContainer
  occurrencesContainer.children.map((occurrenceContainer, index) => {

    //@todo better loading on demand
    const occurrenceData = store.getters.selectedTag.occurrences.find(occurrence => occurrence.origin === occurrenceContainer.name)
    const uid = getOccurrenceUID(tagContainer.name, occurrenceData)
    const thumbName = `${uid}.jpg`;
      
    occurrenceContainer.texture = PIXI.Texture.from(`assets/images/thumb/${occurrenceData.origin}/${thumbName}`);
    occurrenceContainer.tint = 0xffffff;

    if(store.state.activeView === 'tag') {

      // apply interactivity and events
      occurrenceContainer.interactive = true
      occurrenceContainer.buttonMode = true
      occurrenceContainer.on('pointerover', () => {
        const noOfOccurrences = store.getters.selectedTag.occurrences.find(child => {
          return child.origin === occurrenceContainer.name
        }).geometry.length
        console.log(noOfOccurrences, tagContainer.name, 'in', occurrenceContainer.name)
        
      })
      occurrenceContainer.on('pointertap', () => {
        if(store.state.activeView !== 'tag') return;
        console.log('objectContainer tap!');
        store.dispatch('handleSetView', 'object')
        store.dispatch('handleSetActiveObject', occurrenceContainer.name)
      })
    }

    /**
     * 1) create force layout:
     * this.$store.dispatch('computeForceLayout', {
     *   key: 'tagtitle', //will be stored in state.clouds.tagtitle
     *   data: //array of occurences that follows the taglist
     * });
     * data format like:
     *   [{
     *     title: <this is basically the occurence id>,
     *     tagCount: <this is basically the size factor>
     *   }, ...]
     *
     * 2) read the position from store
     * const position = store.getters.positionInCloud('tagtitle', <occurence id>);
     */

    // get distances from selected tagContainer
    const distToLeft = -store.state.canvas.width/3
    const distToRight = store.state.canvas.width/3
    const distToTop = -store.state.canvas.height/3
    const distToBottom = store.state.canvas.height/3

    // scales for mapping Math.random() value to distances from selected tagContainer
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([distToLeft, distToRight])
    const yScale = scaleLinear()
      .domain([0, 1])
      .range([distToTop, distToBottom])

    // updated coordinates
    const updatedCoordinates = {
      x: xScale(Math.random()),
      y: yScale(Math.random())
    }

    // dimensions for Tag view here (from new force layout?!)
    const updatedDimensions = {
      width: Math.sqrt(mockupSettings.dimensionsUnit * store.getters.selectedTag.occurrences[index].geometry.length),
      height: Math.sqrt(mockupSettings.dimensionsUnit * store.getters.selectedTag.occurrences[index].geometry.length)
    }

    let tl = new TimelineMax()
    tl.to(occurrenceContainer, durations.move, {
      x: updatedCoordinates.x,
      y: updatedCoordinates.y,
      width: updatedDimensions.width,
      height: updatedDimensions.height
    })
    
  })
}