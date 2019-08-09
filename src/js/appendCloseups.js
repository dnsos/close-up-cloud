import store from '../store'
import {
  Container,
  Sprite,
  Texture,
  Rectangle,
  Text
} from 'pixi.js'
import { textStyle } from './variables'
import { getRandomInt } from './utils'

export function appendCloseups (tag, PIXIApp) {

  // for development: use actual textures?
  const renderTextures = store.state.helpers.renderTextures

  // get coordinates and dimensions from force layout
  const positioning = store.state.cloud.positioning.find(el => el.title === tag.title)

  // container for storing everything related to tag instance
  const tagContainer = new Container()
  tagContainer.name = tag.title

  // TODO: exchange x and y with correct force layout values
  tagContainer.x = Math.random() * (store.state.canvas.width * 0.8)
  tagContainer.y = Math.random() * (store.state.canvas.height * 0.8)

  // main container that stores all occurrences of tag (image data)
  const occurrencesContainer = new Container()
  occurrencesContainer.name = 'occurrencesContainer'

  // iterate all origins of tag 
  for (const [index, occurrence] of tag.occurrences.entries()) {
    
    // container to hold image data (sprite)
    const occurrenceContainer = new Container()
    occurrenceContainer.name = occurrence.origin
    occurrenceContainer.width = positioning.width
    occurrenceContainer.height = positioning.height

    let imageTexture = null // texture that will render image texture to sprite
    const whiteTexture = Texture.WHITE // texture that will fill all currently not displayed sprites

    if (renderTextures) {
      // retrieve the number of depictions in current occurrence and generate a random index
      const noOfDepictions = occurrence.geometry.length
      const randomIndex = getRandomInt(noOfDepictions)

      // retrieve coordinates and dimensions in origin image
      // divided by two because 50% scaled resources are used
      const frame = new Rectangle(
        occurrence.geometry[randomIndex].x/2,
        occurrence.geometry[randomIndex].y/2,
        occurrence.geometry[randomIndex].width/2,
        occurrence.geometry[randomIndex].width/2)
      
      // access corresponding resource and load its original texture
      const originalTexture = PIXIApp.loader.resources[occurrence.origin].texture

      // clone original texture to avoid cropping original
      const clonedTexture = originalTexture.clone()

      // crop cloned texture using previously generated frame
      clonedTexture.frame = frame

      // assign cropped texture to imageTexture
      imageTexture = clonedTexture
    }

    // determine which texture should be rendered
    const renderedTexture = (index === tag.occurrences.length - 1)
                            ? (renderTextures ? imageTexture : whiteTexture)
                            : whiteTexture
    
    // create sprite from texture to be rendered
    let sprite = new Sprite(renderedTexture)
    sprite.x = 0
    sprite.y = 0
    sprite.width = positioning.width
    sprite.height = positioning.height

    // for development: if textures are not rendered, adds a tint to display sprites
    sprite.tint = renderTextures ? null : 0xff0000

    // only add in Cloud view
    if (store.state.activeView === 'cloud') {

      // add interactivity
      occurrenceContainer.interactive = (index === tag.occurrences.length - 1) ? true : false
      occurrenceContainer.buttonMode = (index === tag.occurrences.length - 1) ? true : false

      // add events
      occurrenceContainer.on('pointerover', () => {
        tagTitle.alpha = 1
      })
      occurrenceContainer.on('pointerout', () => {
        tagTitle.alpha = 0
      })
      occurrenceContainer.on('pointertap', () => {
        store.dispatch('handleSetView', 'tag')
        store.dispatch('handleSetActiveTag', tag.title)
      })
    }

    // add children to respective containers
    occurrenceContainer.addChild(sprite)
    occurrencesContainer.addChild(occurrenceContainer)
    tagContainer.addChild(occurrencesContainer)
  }

  // create and add text for tag title
  const textContent = tag.tagCount + ' ' + tag.title + '\n' + 'in ' + tag.objectCount + ' Objekten'
  const tagTitle = new Text(textContent, textStyle)
  tagTitle.alpha = 0
  tagTitle.name = tag.title
  tagTitle.y = -30
  tagContainer.addChild(tagTitle)
  
  // return container for appending to a parent
  return tagContainer
}