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
): Promise<any> =>
	(await client.query(queryString, variables).toPromise()).data;

export const getRaces = async (): Promise<SrdItem[]> =>
	(await query(GET_RACES)).races;

export const getRace = async (index: string): Promise<SrdRace> =>
	(await query(GET_RACE, { filter: { index } })).race;

export const getClasses = async (): Promise<SrdItem[]> =>
	(await query(GET_CLASSES)).classes;

export const getAbilities = async (): Promise<AbilityItem[]> =>
	(await query(GET_ABILITIES)).abilityScores;

export const getEquipments = async (): Promise<SrdItem[]> =>
	(await query(GET_EQUIPMENTS)).equipments;

export const getSubraces = async (): Promise<SubraceItem[]> =>
	(await query(GET_SUBRACES)).subraces;

export const getSubrace = async (index: string): Promise<SrdSubrace> =>
	(await query(GET_SUBRACE, { filter: { index } })).subrace;
