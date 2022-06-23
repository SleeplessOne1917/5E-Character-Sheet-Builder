export const cleanMessage = (message: string) => {
	const regexResult = /(?:\[GraphQL\] )?(.*)/.exec(message);

	if (regexResult && regexResult[1]) {
		return regexResult[1];
	} else {
		return '';
	}
};
