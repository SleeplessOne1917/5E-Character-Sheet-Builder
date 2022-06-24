import { AbilityItem, SrdItem, SrdSubrace, SubraceItem } from '../types/srd';
import { TypedDocumentNode, createClient } from 'urql';

import { DocumentNode } from 'graphql';
import GET_ABILITIES from './queries/abilities/getAbilities';
import GET_CLASSES from './queries/class/getClasses';
import GET_EQUIPMENTS from './queries/equipment/getEquipments';
import GET_RACE from './queries/race/getRace';
import GET_RACES from './queries/race/getRaces';
import GET_SUBRACE from './queries/subrace/getSubrace';
import GET_SUBRACES from './queries/subrace/getSubraces';
import { SrdRace } from './../types/srd';

const client = createClient({ url: 'https://www.dnd5eapi.co/graphql' });

const query = async (
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: any
) => await client.query(queryString, variables).toPromise();

export const getRaces = async () => await query(GET_RACES);

export const getRace = async (index: string) =>
	await query(GET_RACE, { filter: { index } });

export const getClasses = async (): Promise<SrdItem[] | undefined> =>
	(await query(GET_CLASSES))?.data?.classes;

export const getAbilities = async (): Promise<AbilityItem[] | undefined> =>
	(await query(GET_ABILITIES))?.data?.abilityScores;

export const getEquipments = async (): Promise<SrdItem[] | undefined> =>
	(await query(GET_EQUIPMENTS))?.data?.equipments;

export const getSubraces = async () => await query(GET_SUBRACES);

export const getSubrace = async (index: string) =>
	await query(GET_SUBRACE, { filter: { index } });
