import argon2 from 'argon2';

export const hashValue = async (value: string): Promise<string> =>
	await argon2.hash(value, { type: argon2.argon2id });

export const verifyValue = async (
	hash: string,
	value: string
): Promise<boolean> => await argon2.verify(hash, value);
