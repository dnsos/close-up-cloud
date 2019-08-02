import { Container } from 'pixi.js'

export function preparePIXIApp (PIXIApp) {
  console.log('Init function')
  // resize renderer to whole canvas
  PIXIApp.renderer.autoResize = true
  PIXIApp.renderer.resize(800, 500)
  //PIXIApp.renderer.resize(this.$refs.rendererWrapper.offsetWidth, this.$refs.rendererWrapper.offsetHeight)

  // append PIXI.Application to wrapper
  document.querySelector('.renderer__wrapper').appendChild(PIXIApp.view)

  // create root containers for cloud/tag views and object view
  const cloudContainer = new Container()
  cloudContainer.name = 'cloudContainer'
  const objectContainer = new Container()
  objectContainer.name = 'objectContainer'

  PIXIApp.stage.addChild(cloudContainer, objectContainer)
}