import store from '../store'
import { Sprite, Texture } from 'pixi.js'

export function appendObject (object, PIXIApp) {
  console.log('Object to be added:', object)
  const resource = PIXIApp.loader.resources[object].texture
  const texture = new Texture(resource.baseTexture)
  let sprite = new Sprite(texture)
  return sprite
}