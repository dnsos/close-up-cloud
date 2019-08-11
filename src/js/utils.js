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