const isEmptyArray = (input: any) => Array.isArray(input) && input.length === 0;

export const cleanFormValues = <T>(input: any): T => {
	if (input === null || isEmptyArray(input)) {
		return undefined as T;
	}

	if (Array.isArray(input)) {
		return input.map(obj => cleanFormValues(obj)) as T;
	}

	if (input && typeof input === 'object') {
		return Object.entries(input).reduce<T>(
			(acc, [key, val]) =>
				val === null || isEmptyArray(val)
					? acc
					: val && (val === 'object' || Array.isArray(val))
					? { ...acc, [key]: cleanFormValues(val) }
					: { ...acc, [key]: val },
			{} as T
		);
	}

	return input;
};
