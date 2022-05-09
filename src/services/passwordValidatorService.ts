export const hasLowerCase = (value: string) => /[a-z]/.test(value);

export const hasUpperCase = (value: string) => /[A-Z]/.test(value);

export const hasNumber = (value: string) => /\d/.test(value);

export const hasSpecialCharacter = (value: string) =>
	/[ !"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{}|~]/.test(value);
