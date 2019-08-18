export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * sanitizeLabel
 * removes spaces and interpunctation from a string
 * @param {String} label Label Name
 */
export function sanitizeLabel(label) {
	return label.replace(/[\s.,/()-]/g, '');
}

export function getCutoutUID(tagTitle, sample) {
  
  const labelSant = sanitizeLabel(tagTitle);      
  const filename = sample.origin;
  const top = sample.y;
  const left = sample.x;
  const uid = `${filename}-${labelSant}-${top}-${left}`;

  return uid;
}