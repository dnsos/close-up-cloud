import { TextStyle } from 'pixi.js'

//all durations in seconds
export const durations = {
  sampleFadeIn: 2,      //CloudSamples fade in animation duration 
  sampleVisible: 8,     //CloudSamples shuffle time
  sampleSpread: 1.5,    //CloudSamples spread duration
  sampleSpreadDelay: 1, //CloudSamples spread delay after loading
  detailFadeIn: 1.5,    //CloudDetail fade in animation duration 
  detailFadeOut: 1,     //CloudDetail fade out animation duration 
  worldZoom: 1.5,       //Renderer zoom to fit duration
  mouseZoom: 0.5,       //Renderer mousewheel zoom duration
  move: .4,
  invert: 2             //invert colors animation duration 
}

export const mkgGold = 0xAE9962;

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