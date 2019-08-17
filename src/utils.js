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

//@todo easier parameters
export function getOccurrenceUID(tagTitle, occurrence, geometry) {
  
  const labelSant = sanitizeLabel(tagTitle);      
  const filename = occurrence.origin;
  const top = geometry.y;
  const left = geometry.x;
  const uid = `${filename}-${labelSant}-${top}-${left}`;

  return uid;
}