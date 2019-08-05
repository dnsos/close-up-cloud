import store from '../store'
import { mockupSettings, animationSpeed, textStyle } from './variables'
import { Text } from 'pixi.js'
import { TimelineMax } from 'gsap/TweenMax'

export function spreadSelectedTag (tagContainer, PIXIApp) {

  const tagTitle = tagContainer.children.find(child => child.text)
  tagTitle.visible= false

  const occurrencesContainer = tagContainer.children.find(child => child.name === 'occurrencesContainer')

  occurrencesContainer.children.map((occurrenceContainer, index) => {

    if(store.state.activeView === 'tag') {
      occurrenceContainer.interactive = true
      occurrenceContainer.buttonMode = true
      occurrenceContainer.on('pointertap', () => {
        store.dispatch('handleSetView', 'object')
        store.dispatch('handleSetActiveObject', occurrenceContainer.name)
      })
    }

    // append texture
    /*const resource = PIXIApp.loader.resources[occurrenceContainer.name]
    const crop = new Rectangle(100,100,200,200)
    occurrenceContainer.children[0].texture = new Texture(resource.texture, crop)*/

    // coordinates for Tag view here (from new force layout?!)
    const updatedCoordinates = {
      x: 50 * index,
      y: null
    }

    // dimensions for Tag view here (from new force layout?!)
    const updatedDimensions = {
      width: Math.sqrt(mockupSettings.dimensionsUnit * store.getters.selectedTag.occurrences[index].geometry.length),
      height: Math.sqrt(mockupSettings.dimensionsUnit * store.getters.selectedTag.occurrences[index].geometry.length)
    }

    let tl = new TimelineMax()
    tl.to(occurrenceContainer, animationSpeed, {
      x: updatedCoordinates.x,
      width: updatedDimensions.width,
      height: updatedDimensions.height
    })
    
  })
}