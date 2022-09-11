export const convertRemToPixels = (rem: number) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
