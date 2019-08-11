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

//@todo this only ever handles the first geometry ...
export function getOccurrenceUID(tagTitle, occurrence) {
  
  const labelSant = sanitizeLabel(tagTitle);      
  const filename = occurrence.origin;
  const top = occurrence.geometry[0].y;
  const left = occurrence.geometry[0].x;
  const uid = `${filename}-${labelSant}-${top}-${left}`;

  return uid;
}