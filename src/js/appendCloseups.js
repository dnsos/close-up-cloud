import store from '../store'
import {
  Container,
  Sprite,
  Texture,
  Rectangle,
  Text
} from 'pixi.js'
import { mockupSettings, textStyle } from './variables'

export function createCloseupBox(properties) {
  
  // container for storing sprite, text etc. in
  const tagContainer = new Container()
  tagContainer.name = properties.title
  tagContainer.x = properties.x
  tagContainer.y = properties.y

  const whiteTexture = Texture.WHITE
  let sprite = new Sprite(whiteTexture)
  sprite.x = 0
  sprite.y = 0
  sprite.width = properties.size
  sprite.height = properties.size

  // only for debugging
  sprite.tint = 0xff0000
  sprite.alpha = 0.5
  tagContainer.addChild(sprite)

  // create text for tag title
  const tagTitle = new Text(properties.title + ' (' + properties.tagCount + ')', textStyle)
  tagTitle.alpha = 0.1
  tagTitle.name = properties.title
  tagTitle.y = 0;//Math.sqrt(mockupSettings.dimensionsUnit * properties.tagCount)
  tagContainer.addChild(tagTitle)
  
  // return container for appending to a parent
  return tagContainer

  //console.log('appendCloseups', tagContainer.x, tagContainer.y)

  //const occurrencesContainer = new Container()
  //occurrencesContainer.name = 'occurrencesContainer'

  // create container for each tag origin
  /*for (const [index, occurrence] of properties.occurrences.entries()) {
    
    // container to hold all occurrences of tag from iterated origin
    const occurrenceContainer = new Container()
    occurrenceContainer.name = occurrence.origin

    /* texture adding
    const noOfOccurrences = occurrence.geometry.length
    const randomIndex = getRandomInt(noOfOccurrences)
    // retrieve coordinates/dimensions in origin image
    const crop = new Rectangle(
      occurrence.geometry[randomIndex].x/2,
      occurrence.geometry[randomIndex].y/2,
      occurrence.geometry[randomIndex].width/2,
      occurrence.geometry[randomIndex].width/2)
    
    // load origin image from PIXI loader
    const resource = PIXIApp.loader.resources[occurrence.origin].texture
    // create texture from crop of origin image
    const imageTexture = new Texture(resource, crop)
    imageTexture.updateUvs() // https://pixijs.download/dev/docs/PIXI.Texture.html#updateUvs
    * /

    const whiteTexture = Texture.WHITE

    const renderedTexture = (index === properties.occurrences.length - 1) ? whiteTexture : whiteTexture
    
    // create sprite from texture
    let sprite = new Sprite(renderedTexture)
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.width
    sprite.height = position.height

    // only for debugging
    sprite.tint = 0xff0000
    sprite.alpha = 0.2

    // only add in Cloud view
    if (store.state.activeView === 'cloud') {

      // add interactivity
      occurrenceContainer.interactive = (index === properties.occurrences.length - 1) ? true : false
      occurrenceContainer.buttonMode = (index === properties.occurrences.length - 1) ? true : false

      // add events
      occurrenceContainer.on('pointerover', () => {
        tagTitle.alpha = 1
      })
      occurrenceContainer.on('pointerout', () => {
        tagTitle.alpha = 0
      })
      occurrenceContainer.on('pointertap', () => {
        store.dispatch('handleSetView', 'tag')
        store.dispatch('handleSetActiveTag', properties.title)
      })
    }

    // add sprite to occurrence container
    occurrenceContainer.addChild(sprite)
    occurrencesContainer.addChild(occurrenceContainer)
    tagContainer.addChild(occurrencesContainer)
  }*/
  
}