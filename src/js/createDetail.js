import * as PIXI from 'pixi.js'
import store from '../store'

//ex appendObject
export function createDetail(objectID) {
  console.log('createDetail', objectID)
  
  const texture = PIXI.Texture.from(`assets/images/thumb/${objectID}/${objectID}.jpg`);
  const sprite = new PIXI.Sprite(texture)
  /*const desiredHeight = store.state.canvas.height - 80;
  const ratio = (desiredHeight / sprite.height);
  sprite.scale.set(ratio);*/
  sprite.scale.set(0.5);
  sprite.x = store.state.canvas.width / 2
  sprite.y = store.state.canvas.height / 2
  sprite.anchor.set(0.5)

  return sprite
}