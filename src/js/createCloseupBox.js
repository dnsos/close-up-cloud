import * as PIXI from 'pixi.js'
//import 'pixi-layers'
import store from '../store'
import { textStyle } from './variables'
import { getRandomInt } from './utils'

//ex appendCloseups
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
  textBox.name = 'textBox'
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
    if(store.state.activeView !== 'cloud') return;
    console.log('tagContainer tap!');
    store.dispatch('handleSetView', 'tag')
    store.dispatch('handleSetActiveTag', tag)
  })

  // create container for each tag origin
  for (const [index, occurrence] of tag.occurrences.entries()) {
    
    // create sprite from texture to be rendered
    let sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    sprite.name = occurrence.origin
    sprite.x = 0
    sprite.y = 0
    sprite.width = position.size
    sprite.height = position.size

    // for development: adds a random tint that will be removed on load
    sprite.tint = '0x' + Math.floor(Math.random()*16777215).toString(16);

    // add children to respective containers
    occurrencesContainer.addChild(sprite)
  }

  return tagContainer
}