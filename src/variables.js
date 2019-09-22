import { TextStyle } from 'pixi.js'

//all durations in seconds
export const durations = {
  sampleFadeIn: 2,    //CloudSamples fade in animation duration 
  sampleVisible: 8,   //CloudSamples shuffle time
  detailFadeIn: 1.5,  //CloudDetail fade in animation duration 
  move: .4,
  invert: 2           //invert colors animation duration 
}

export const textStyle = {
  regular: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 16,
    fontWeight: 400
  }),
  medium: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 16,
    fontWeight: 600
  }),
  bold: new TextStyle({
    fontFamily: "\"Overpass\", sans-serif",
    fontSize: 16,
    fontWeight: 800
  })
}