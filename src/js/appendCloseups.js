import * as PIXI from 'pixi.js'
import store from '../store'
import { textStyle } from './variables'

export function createCloseupBox(title) {

  const position = store.getters.positionInCloud('overview', title);
  const tag = store.getters.tag(title);
  
  // container for storing sprite, text etc. in
  const tagContainer = new PIXI.Container()
  tagContainer.name = tag.title
  tagContainer.x = position.x
  tagContainer.y = position.y

  const whiteTexture = PIXI.Texture.WHITE

  // placeholder sprite
  let sprite = new PIXI.Sprite(whiteTexture)
  sprite.x = 0
  sprite.y = 0
  sprite.width = position.size
  sprite.height = position.size
  sprite.alpha = 0.8
  tagContainer.addChild(sprite)

  // create text for tag title
  const textContent = tag.tagCount + ' ' + tag.title + '\n' + 'in ' + tag.objectCount + ' Objekten'
  const tagTitle = new PIXI.Text(textContent, textStyle)
  tagTitle.name = tag.title
  tagTitle.x = 5

  const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
  txtBG.width = tagTitle.width + 10;
  txtBG.height = tagTitle.height;

  
  const textBox = new PIXI.Container();
  textBox.isTextContainer = true;
  textBox.alpha = 0
  textBox.x = 5
  textBox.y = 5
  textBox.addChild(txtBG, tagTitle);

  tagContainer.addChild(textBox)
  

  // add interactivity
  sprite.interactive = true;
  sprite.buttonMode = true;

  // add events
  sprite.on('pointerover', () => {
    textBox.alpha = 1
    sprite.alpha = 1
  })
  sprite.on('pointerout', () => {
    textBox.alpha = 0
    sprite.alpha = 0.95
  })
  sprite.on('pointertap', () => {
    store.dispatch('handleSetView', 'tag')
    store.dispatch('handleSetActiveTag', tag.title)
  })
  
  // return container for appending to a parent
  return tagContainer

  //console.log('appendCloseups', tagContainer.x, tagContainer.y)

  //const occurrencesContainer = new PIXI.Container()
  //occurrencesContainer.name = 'occurrencesContainer'

  // create container for each tag origin
  /*for (const [index, occurrence] of properties.occurrences.entries()) {
    
    // container to hold image data (sprite)
    const occurrenceContainer = new PIXI.Container()
    occurrenceContainer.name = occurrence.origin
    occurrenceContainer.width = positioning.width
    occurrenceContainer.height = positioning.height

    // retrieve the number of depictions in current occurrence and generate a random index
    const noOfDepictions = occurrence.geometry.length
    const randomIndex = getRandomInt(noOfDepictions)

    // retrieve coordinates and dimensions in origin image
    // divided by two because 50% scaled resources are used
    const frame = new PIXI.Rectangle(
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

    const whiteTexture = PIXI.Texture.WHITE // texture that will fill all currently not displayed sprites

    // determine which texture should be rendered
    const renderedTexture = (index === tag.occurrences.length - 1)
                            ? ((renderCloseups === true) ? clonedTexture : whiteTexture)
                            : whiteTexture
    
    // create sprite from texture to be rendered
    let sprite = new PIXI.Sprite(renderedTexture)
    sprite.x = 0
    sprite.y = 0
    sprite.width = positioning.width
    sprite.height = positioning.height

    // for development: if textures are not rendered, adds a tint to display sprites
    sprite.tint = (renderCloseups === true) ? 0xffffff : 0xff0000

    // only add in Cloud view
    if (store.state.activeView === 'cloud') {

      // add interactivity
      occurrenceContainer.interactive = (index === tag.occurrences.length - 1) ? true : false
      occurrenceContainer.buttonMode = (index === tag.occurrences.length - 1) ? true : false
    }

    // add children to respective containers
    occurrenceContainer.addChild(sprite)
    occurrencesContainer.addChild(occurrenceContainer)
    tagContainer.addChild(occurrencesContainer)

  }
    */

}