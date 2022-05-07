import { AbilityItem, SrdItem } from '../types/srd';
import { QueryProps, TypedDocumentNode, createClient } from 'urql';

import { DocumentNode } from 'graphql';
import GET_ABILITIES from './queries/abilities/getAbilities';
import GET_CLASSES from './queries/class/getClasses';
import GET_EQUIPMENTS from './queries/equipment/getEquipments';
import GET_RACES from './queries/race/getRaces';

const client = createClient({ url: 'https://www.dnd5eapi.co/graphql' });

const query = async (
	queryString: string | DocumentNode | TypedDocumentNode,
	options?: QueryProps
): Promise<any> => (await client.query(queryString, options).toPromise()).data;

export const getRaces = async (): Promise<SrdItem[]> =>
	(await query(GET_RACES)).races;

export const getClasses = async (): Promise<SrdItem[]> =>
	(await query(GET_CLASSES)).classes;

export const getAbilities = async (): Promise<AbilityItem[]> =>
	(await query(GET_ABILITIES)).abilityScores;

export const getEquipments = async (): Promise<SrdItem[]> =>
	(await query(GET_EQUIPMENTS)).equipments;
