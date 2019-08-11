import store from '../store'
import { getRandomInt } from './utils'
import { mockupSettings, durations } from './variables'
import { scaleLinear } from 'd3'
import { TimelineMax } from 'gsap/TweenMax'
import { Rectangle } from 'pixi.js';

export function spreadSelectedTag (tagContainer, PIXIApp) {

  // for development: use actual textures?
  const renderCloseups = store.state.helpers.renderCloseups

  // hide tag title for events
  const tagTitle = tagContainer.children.find(child => child.isTextContainer)
  tagTitle.visible= false

  // reference container with occurrences
  const occurrencesContainer = tagContainer.children.find(child => child.name === 'occurrencesContainer')

  // assign an image texture to each occurrenceContainer
  occurrencesContainer.children.map((occurrenceContainer, index) => {

    // reference data for current occurrence
    const occurrenceData = store.getters.selectedTag.occurrences.find(occurrence => occurrence.origin === occurrenceContainer.name)

    if (renderCloseups) {
      // retrieve the number of depictions in current occurrence and generate a random index
      const noOfDepictions = occurrenceData.geometry.length
      const randomIndex = getRandomInt(noOfDepictions)

      // retrieve coordinates and dimensions in origin image
      // divided by two because 50% scaled resources are used
      const frame = new Rectangle(
        occurrenceData.geometry[randomIndex].x/2,
        occurrenceData.geometry[randomIndex].y/2,
        occurrenceData.geometry[randomIndex].width/2,
        occurrenceData.geometry[randomIndex].width/2)

      // access corresponding resource and load its original texture
      const originalTexture = PIXIApp.loader.resources[occurrenceContainer.name].texture 

      // clone texture
      const clonedTexture = originalTexture.clone()

      // crop to frame
      clonedTexture.frame = frame
      
      // update texture
      occurrenceContainer.children[0].texture = clonedTexture
    }

    // for development: if textures are not rendered, adds a tint to display sprites
    occurrenceContainer.children[0].tint = (renderCloseups === true) ? 0xffffff : 0x00ffff

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
        store.dispatch('handleSetView', 'object')
        store.dispatch('handleSetActiveObject', occurrenceContainer.name)
      })
    }

    // get distances from selected tagContainer
    const distToLeft = -tagContainer.x
    const distToRight = store.state.canvas.width - tagContainer.x
    const distToTop = -tagContainer.y
    const distToBottom = store.state.canvas.height - tagContainer.y 

    // scales for mapping Math.random() value to distances from selected tagContainer
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([distToLeft/2, distToRight/2])
    const yScale = scaleLinear()
      .domain([0, 1])
      .range([distToTop/2, distToBottom/2])

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