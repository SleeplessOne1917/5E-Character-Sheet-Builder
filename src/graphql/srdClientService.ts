import {
	AbilityItem,
	SrdItem,
	SrdSubrace,
	SrdSubraceItem,
	SrdRace
} from '../types/srd';
import { TypedDocumentNode, createClient } from 'urql';

import { DocumentNode } from 'graphql';
import GET_ABILITIES from './queries/5E-API/abilities/getAbilities';
import GET_CLASSES from './queries/5E-API/class/getClasses';
import GET_EQUIPMENTS from './queries/5E-API/equipment/getEquipments';
import GET_RACE from './queries/5E-API/race/getRace';
import GET_RACES from './queries/5E-API/race/getRaces';
import GET_SUBRACE from './queries/5E-API/subrace/getSubrace';
import GET_SUBRACES from './queries/5E-API/subrace/getSubraces';

const client = createClient({ url: 'https://www.dnd5eapi.co/graphql' });

const query = async <TResponse>(
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: any
) => await client.query<TResponse>(queryString, variables).toPromise();

export const getRaces = async () =>
	await query<{ races: SrdItem[] }>(GET_RACES);

export const getRace = async (index: string) =>
	await query<{ race: SrdRace }>(GET_RACE, { index });

export const getClasses = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ classes: SrdItem[] }>(GET_CLASSES))?.data?.classes;

export const getAbilities = async (): Promise<AbilityItem[] | undefined> =>
	(await query<{ abilityScores: AbilityItem[] }>(GET_ABILITIES))?.data
		?.abilityScores;

export const getEquipments = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ equipments: SrdItem[] }>(GET_EQUIPMENTS))?.data?.equipments;

export const getSubraces = async () =>
	await query<{ subraces: SrdSubraceItem[] }>(GET_SUBRACES);

export const getSubrace = async (index: string) =>
	await query<{ subrace: SrdSubrace }>(GET_SUBRACE, { index });
