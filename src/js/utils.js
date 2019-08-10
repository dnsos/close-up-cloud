export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function sanitizeLabel(label) {
	return label.replace(/[\s.,/()]/g, '');
}