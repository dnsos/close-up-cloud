/**
 * sanitizeLabel
 * removes spaces and interpunctation from a string
 * @param {String} label Label Name
 */
export function sanitizeLabel(label) {
	return label.replace(/[\s.,/()-]/g, '');
}

/**
 * getCutoutUID
 * Creates a unique identifier for a cutout - that is also the filename
 * @param {String} tagTitle 
 * @param {Object} sample 
 */
export function getCutoutUID(tagTitle, sample) {
  
  const labelSant = sanitizeLabel(tagTitle);      
  const filename = sample.origin;
  const top = sample.y;
  const left = sample.x;
  const uid = `${filename}-${labelSant}-${top}-${left}`;

  return uid;
}

/**
 * convertTagOccurencesToCloudItems
 * Converts raw data occurences to cloudItem format (see readme).
 * This is located here because it's required in multiple places 
 * (for normal VizTag View, but also for the spread animation)-
 * @param {Object} tag 
 */
export function convertTagOccurencesToCloudItems(tag) {

  return tag.occurrences.map(occ => {

    //per occurencant object: sample all geometries
    const samples = occ.geometry.map(geo => {
      const sample = {
        origin: occ.origin,
        x: geo.x,
        y: geo.y,
        size: geo.size
      }
      sample.id = getCutoutUID(tag.title, sample);
      return sample;
    });

    return {
      id: occ.origin,
      weight: samples.length,
      samples: samples
    }
  });
}


/**
 * getBBoxScaleFactor
 * calcs a factor for frameBBox to fit into canvas
 * @param {*} canvas {width, height}
 * @param {*} frameBBox {width, height}
 */
export function getBBoxScaleFactor(canvas, frameBBox, padding) {
      
  if(!padding) padding = 0;
  const canvasRatio = canvas.width / canvas.height;
  const frameRatio = frameBBox.width / frameBBox.height;

  let scaleFactor;
  if(frameRatio > canvasRatio) {
    scaleFactor = (canvas.width - (padding*2)) / (frameBBox.width);
  } else {
    scaleFactor = (canvas.height - (padding*2)) / (frameBBox.height);
  }

  return scaleFactor;
}