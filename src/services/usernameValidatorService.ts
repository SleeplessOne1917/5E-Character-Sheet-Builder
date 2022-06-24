export const hasValidUsername = (value: string) =>
	/^[A-Za-z][A-Za-z\d]*$/.test(value);
