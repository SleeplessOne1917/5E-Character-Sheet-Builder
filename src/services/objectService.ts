const intersect = <T>(s1: Set<T>, s2: Set<T>) =>
	new Set([...s1].filter(val => s2.has(val)));

export const deepEquals = (value1: any, value2: any): boolean => {
	if (
		value1 !== null &&
		value2 !== null &&
		typeof value1 === 'object' &&
		typeof value2 === 'object'
	) {
		if (Array.isArray(value1) && Array.isArray(value2)) {
			if (value1.length !== value2.length) {
				return false;
			}

			return value1.every((val, index) => deepEquals(val, value2[index]));
		} else {
			const val1Keys = Object.keys(value1);
			const val2Keys = Object.keys(value2);
			const intersectKeys = intersect(new Set(val1Keys), new Set(val2Keys));

			if (
				intersectKeys.size === val1Keys.length &&
				intersectKeys.size === val2Keys.length
			) {
				return [...intersectKeys].every(key =>
					deepEquals(value1[key], value2[key])
				);
			} else {
				return false;
			}
		}
	} else return value1 === value2;
};
