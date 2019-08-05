import store from '../store'
import { Container } from 'pixi.js'

export function preparePIXIApp (PIXIApp) {

  // resize renderer to whole canvas
  PIXIApp.renderer.autoResize = true
  PIXIApp.renderer.resize(store.state.canvas.width, store.state.canvas.height)

  // append PIXI.Application to wrapper
  document.querySelector('.renderer__wrapper').appendChild(PIXIApp.view)

  // create root containers for cloud/tag views and object view
  const cloudContainer = new Container()
  cloudContainer.name = 'cloudContainer'
  const objectContainer = new Container()
  objectContainer.name = 'objectContainer'

  PIXIApp.stage.addChild(cloudContainer, objectContainer)
  console.log('cloudContainer + objectContainer added to stage')
  
}