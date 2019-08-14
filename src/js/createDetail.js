import * as PIXI from 'pixi.js'
import store from '../store'

//ex appendObject
export function createDetail(objectID) {
  console.log('createDetail', objectID)
  const objectData = store.getters.object(objectID)

  const objectContainer = new PIXI.Container()
  objectContainer.x = store.state.canvas.width / 2
  objectContainer.y = store.state.canvas.height / 2

  const loader = new PIXI.Loader()
  loader
    .add(objectID, `assets/images/thumb/${objectID}/${objectID}.jpg`)
    .load((loader, resources) => {

      const texture = resources[objectID].texture
      const sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.5)

      const textureHeight = texture.baseTexture.height
      const textureWidth = texture.baseTexture.width

      const desiredHeight = store.state.canvas.height
      const ratio = (desiredHeight / textureHeight)

      objectContainer.scale.set(ratio)
      objectContainer.addChild(sprite)

      /* not working yet
      const tagContainers = new PIXI.Container()
      for (const tag of objectData.tags) {
        const tagContainer = new PIXI.Container()
        tagContainer.name = tag.title
        tagContainers.addChild(tagContainer)
        for (const geometry of tag.geometry) {
          const gfx = new PIXI.Graphics()
          gfx.lineStyle(2, 0x00ffff)
          gfx.beginFill(0xff00ff, 0.1)
          gfx.drawRect((geometry.x*ratio), (geometry.y*ratio), geometry.width*ratio, geometry.width*ratio)
          gfx.endFill()
          tagContainer.addChild(gfx)
        }
      }
      //tagContainers.scale.set(ratio)
      tagContainers.x = -(textureWidth / 2)
      tagContainers.y = -(textureHeight / 2)
      objectContainer.addChild(tagContainers)
      */
    })

  return objectContainer
}