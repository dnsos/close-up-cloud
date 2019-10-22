import { TimelineMax } from 'gsap/TweenMax'

export function hideUnselectedTags (tagContainers) {
  tagContainers.map(tagContainer => {
    let tl = new TimelineMax()
    tl.to(tagContainer, .2, { alpha: 0 })
    tagContainer.interactiveChildren = false
  })
}