import { TextStyle } from 'pixi.js'

export const durations = {
  move: .4,
  invert: 2
}

export const textStyle = {
  regular: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 18,
    fontWeight: 400
  }),
  medium: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 18,
    fontWeight: 600
  }),
  bold: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 18,
    fontWeight: 800
  })
}