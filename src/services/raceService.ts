import {
	getRace as getSrdRace,
	getSubrace as getSrdSubrace
} from '../graphql/srdClientService';

export const getRace = (index: string) => getSrdRace(index);

export const getSubrace = (index: string) => getSrdSubrace(index);
