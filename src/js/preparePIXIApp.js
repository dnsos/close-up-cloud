import store from '../store'
import { Container, filters } from 'pixi.js'

export function preparePIXIApp (PIXIApp) {

  // resize renderer to whole canvas
  PIXIApp.renderer.autoResize = true
  PIXIApp.renderer.resize(store.state.canvas.width, store.state.canvas.height)

  // append PIXI.Application to wrapper
  document.querySelector('.renderer__wrapper').appendChild(PIXIApp.view)

  // init negative filter (tween between alpha values)
  let colorMatrix = new filters.ColorMatrixFilter()
  colorMatrix.negative()
  colorMatrix.alpha = 0
  PIXIApp.stage.filters = [colorMatrix]

  // create root containers for cloud/tag views and object view
  const cloudContainer = new Container()
  cloudContainer.name = 'cloudContainer'
  const objectContainer = new Container()
  objectContainer.name = 'objectContainer'

  PIXIApp.stage.addChild(cloudContainer, objectContainer)
}