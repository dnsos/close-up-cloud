import store from '../store'
import { Sprite } from 'pixi.js'

export function appendObject (object, PIXIApp) {
  console.log('Object to be added:', object)
  const resource = PIXIApp.loader.resources[object].texture
  let sprite = new Sprite(resource)
  return sprite
}