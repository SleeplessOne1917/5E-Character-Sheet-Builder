export const getOrdinal = (n: number) => {
	const strNum = `${n}`;

	let ordinal = '';
	if (strNum.endsWith('1') && !strNum.endsWith('11')) {
		ordinal = 'st';
	} else if (strNum.endsWith('2') && !strNum.endsWith('12')) {
		ordinal = 'nd';
	} else if (strNum.endsWith('3') && !strNum.endsWith('13')) {
		ordinal = 'rd';
	} else {
		ordinal = 'th';
	}

	return `${strNum}${ordinal}`;
};
