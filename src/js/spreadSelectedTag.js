import store from '../store'
import { durations } from './variables'
import { TimelineMax, TweenMax } from 'gsap/TweenMax'
import { getOccurrenceUID } from '../js/utils.js'

export function spreadSelectedTag (tagContainer) {

  const tagName = tagContainer.name;

  // hide tag title for events
  const tagTitle = tagContainer.children.find(child => child.name === 'textBox')
  tagTitle.visible = false

  // reference container with occurrences
  const occurrencesContainer = tagContainer.children.find(child => child.name === 'occurrencesContainer')
  const forceInput = [];

  // assign an image texture to each occurrenceContainer
  occurrencesContainer.children.map((occurrenceContainer, index) => {

    const occurrence = store.getters.findOccurenceInActiveTag(occurrenceContainer.name)
    const noOfOccurrences = occurrence.geometry.length

    //@todo router stuff
    if(store.state.activeView === 'tag') {

      // apply interactivity and events
      occurrenceContainer.interactive = true
      occurrenceContainer.buttonMode = true
      occurrenceContainer.on('pointerover', () => {
        console.log(noOfOccurrences, tagName, 'in', occurrenceContainer.name)
        
      })
      occurrenceContainer.on('pointertap', () => {
        if(store.state.activeView !== 'tag') return;
        console.log('objectContainer tap!');
        store.dispatch('handleSetView', 'object')
        store.dispatch('handleSetActiveObject', occurrenceContainer.name)
      })
    }

    forceInput.push({
      id: occurrence.origin, 
      weight: noOfOccurrences
    })

    //@todo better loading on demand
    const uid = getOccurrenceUID(tagName, occurrence)
    const thumbName = `${uid}.jpg`;  
    occurrenceContainer.texture = PIXI.Texture.from(`assets/images/thumb/${occurrence.origin}/${thumbName}`);
    occurrenceContainer.tint = 0xffffff;
  })


  //create force layout for this tag
  if(!store.state.clouds[tagName]) {
    store.dispatch('computeForceLayout', {
        key: tagName,
        data: forceInput
    });
  }

  //center tagContainer
  new TimelineMax()
    .add( TweenMax.to(tagContainer, 3, {
      x: -tagContainer.width/2,
      y: -tagContainer.height/2
    }) ).play();

  //apply force layout
  store.getters.cloud(tagName).forEach((rect, i) => {
      
    const occurrenceContainer = occurrencesContainer.children.find(el => el.name === rect.id)

    //@todo scale the force layout to fit screen
    new TimelineMax().add(TweenMax.to(occurrenceContainer, 2, {
      x: rect.x * 2, 
      y: rect.y * 2,
      width: rect.size * 2,
      height: rect.size * 2
    }))
  })
}