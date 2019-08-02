import store from '../store'
import { mockupSettings, animationSpeed } from './variables'
import { TimelineMax } from 'gsap/TweenMax'

export function spreadSelectedTag (tagContainer) {
  console.log('Tag container', tagContainer)
  const occurrencesContainer = tagContainer.children.find(child => child.name === 'occurrencesContainer')

  occurrencesContainer.children.map((occurrenceContainer, index) => {

    // coordinates for Tag view here (from new force layout?!)
    const updatedCoordinates = {
      x: 100 * index,
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