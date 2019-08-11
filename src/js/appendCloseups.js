import * as PIXI from 'pixi.js'
//import 'pixi-layers'
import store from '../store'
import { textStyle } from './variables'
import { getRandomInt } from './utils'

export function createCloseupBox(title) {

  const position = store.getters.positionInCloud('overview', title);
  const tag = store.getters.tag(title);
  
  const tagContainer = new PIXI.Container()
  tagContainer.name = tag.title
  tagContainer.x = position.x
  tagContainer.y = position.y

  //trying to build layers ...
  //const infoLayer = new PIXI.display.Group(1, false);
  //const thumbLayer = new PIXI.display.Group(0, true);
  //let thumbIndex = 0;
  //thumbLayer.on('add', sprite => sprite.zOrder = thumbIndex--)
  //tagContainer.addChild(new PIXI.display.Layer(infoLayer));
  //tagContainer.addChild(new PIXI.display.Layer(thumbLayer));

  // create tag title
  const textBox = new PIXI.Container();
  textBox.alpha = 0
  textBox.x = 5
  textBox.y = 5
  //textBox.parentLayer = infoLayer;
  
  const textContent = tag.tagCount + ' ' + tag.title + '\n' + 'in ' + tag.objectCount + ' Objekten'
  const tagTitle = new PIXI.Text(textContent, textStyle)
  tagTitle.name = tag.title
  tagTitle.x = 5

  const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
  txtBG.width = tagTitle.width + 10;
  txtBG.height = tagTitle.height;
  textBox.addChild(txtBG, tagTitle);

  const occurrencesContainer = new PIXI.Container()
  occurrencesContainer.name = 'occurrencesContainer'

  tagContainer.addChild(occurrencesContainer)
  tagContainer.addChild(textBox)

  // add interactivity
  occurrencesContainer.interactive = true;
  occurrencesContainer.buttonMode = true;

  // add events
  occurrencesContainer.on('pointerover', () => {
    textBox.alpha = 1
  })
  occurrencesContainer.on('pointerout', () => {
    textBox.alpha = 0
  })
  occurrencesContainer.on('pointertap', () => {
    store.dispatch('handleSetView', 'tag')
    store.dispatch('handleSetActiveTag', tag.title)
  })

  // create container for each tag origin
  for (const [index, occurrence] of tag.occurrences.entries()) {
    
    //@todo needed?
    // container to hold image data (sprite)
    /*const occurrenceContainer = new PIXI.Container() 
    occurrenceContainer.name = occurrence.origin
    occurrenceContainer.width = position.size
    occurrenceContainer.height = position.size*/
    //occurrenceContainer.parentGroup = thumbLayer;

    // retrieve the number of depictions in current occurrence and generate a random index
    /*const noOfDepictions = occurrence.geometry.length
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

    // determine which texture should be rendered
    const renderedTexture = (index === tag.occurrences.length - 1)
                            ? ((renderCloseups === true) ? clonedTexture : whiteTexture)
                            : whiteTexture*/
    
    // create sprite from texture to be rendered
    let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size

    // for development: if textures are not rendered, adds a tint to display sprites
    //sprite.tint = (renderCloseups === true) ? 0xffffff : 0xff0000
    //random tint
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // only add in Cloud view
    /*if (store.state.activeView === 'cloud') {

      // add interactivity
      occurrenceContainer.interactive = (index === tag.occurrences.length - 1) ? true : false
      occurrenceContainer.buttonMode = (index === tag.occurrences.length - 1) ? true : false
    }*/

    // add children to respective containers
    //occurrenceContainer.addChild(sprite)
    occurrencesContainer.addChild(sprite)
  }

  return tagContainer
}