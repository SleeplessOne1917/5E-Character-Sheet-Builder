import {
	getRace as getSrdRace,
	getSubrace as getSrdSubrace
} from '../graphql/srdClientService';

export const getRace = async (index: string) => await getSrdRace(index);

export const getSubrace = async (index: string) => await getSrdSubrace(index);
