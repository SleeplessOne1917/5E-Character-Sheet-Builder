export const capitalize = (str: string) => {
	const [first, ...rest] = str;
	return first.toUpperCase() + rest.join('').toLowerCase();
};
