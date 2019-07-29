import * as PIXI from 'pixi.js'

export function appendCloseups (properties, PIXIApp) {
  
  // test occurence. TODO: function needs to append all occurences
  const testOccurence = properties.occurences[0]

  // define positions in origin image
  const crop = new PIXI.Rectangle(
    testOccurence.geometry[0].x,
    testOccurence.geometry[0].y,
    testOccurence.geometry[0].width,
    testOccurence.geometry[0].width)

  // load origin image from PIXI loader
  const resource = PIXIApp.loader.resources[testOccurence.origin]

  // create texture from crop of origin image
  const texture = new PIXI.Texture(resource.texture, crop)
  
  // mockup coordinates and dimensions. TODO: automatise!
  let sprite = new PIXI.Sprite(texture)
  sprite.x = Math.random()*500
  sprite.y = Math.random()*500
  sprite.width = 200
  sprite.height = 200

  // return sprite for appending it to a container
  return sprite
  
}