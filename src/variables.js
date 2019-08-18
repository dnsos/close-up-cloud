import { TextStyle } from 'pixi.js'

export const publicDataUrl = '/assets/data/objects-label-metadata.json';
export const publicImageUrl = '/assets/images/';

export const mockupSettings = {
  dimensionsUnit: 500
}
export const durations = {
  move: .4,
  invert: 2
}

export const textStyle = new TextStyle({
  fontFamily: "\"Overpass\", sans-serif",
  fontSize: 14,
  fontWeight: 400,
  dropShadow: false,
  dropShadowAngle: 0,
  dropShadowBlur: 5,
  dropShadowDistance: 2
})