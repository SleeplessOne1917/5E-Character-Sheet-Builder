export const isObjectId = (value?: string) =>
	!!value && /^[0-9a-fA-F]{24}$/.test(value);
