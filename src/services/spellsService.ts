import { getSpellsByClass as getSrdSpellsByClass } from '../graphql/srdClientService';

export const getSpellsByClass = async (klass: string | string[]) =>
	await getSrdSpellsByClass(klass);
