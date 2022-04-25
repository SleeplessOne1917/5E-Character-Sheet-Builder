import argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> =>
	await argon2.hash(password, { type: argon2.argon2id });

export const verifyPassword = async (
	hash: string,
	password: string
): Promise<boolean> => await argon2.verify(hash, password);
