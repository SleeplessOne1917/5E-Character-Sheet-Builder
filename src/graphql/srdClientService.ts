import {
	AbilityItem,
	MonsterSubtype,
	MonsterType,
	SrdFullRaceItem,
	SrdFullSubraceItem,
	SrdItem,
	SrdProficiencyItem,
	SrdSpellItem,
	SrdSubraceItem
} from '../types/srd';
import { ProficiencyType, SrdFullClassItem } from './../types/srd';
import { TypedDocumentNode, createClient } from 'urql';

import { DocumentNode } from 'graphql';
import GET_ABILITIES from './queries/5E-API/abilities/getAbilities';
import GET_CLASS from './queries/5E-API/class/getClass';
import GET_CLASSES from './queries/5E-API/class/getClasses';
import GET_EQUIPMENTS from './queries/5E-API/equipment/getEquipments';
import GET_MONSTER_TYPES from './queries/5E-API/monsters/getMonsterTypes';
import GET_PROFICIENCIES_BY_TYPE from './queries/5E-API/proficiencies/proficienciesByType';
import GET_RACE from './queries/5E-API/race/getRace';
import GET_RACES from './queries/5E-API/race/getRaces';
import GET_SPELLS_BY_CLASS from './queries/5E-API/spells/getSpellsByClass';
import GET_SUBRACE from './queries/5E-API/subrace/getSubrace';
import GET_SUBRACES from './queries/5E-API/subrace/getSubraces';
import GET_MAGIC_SCHOOLS from './queries/5E-API/magic-schools/getMagicSchools';
import GET_DAMAGE_TYPES from './queries/5E-API/damage-types/getDamageTypes';
import GET_SPELLCASTING_CLASSES from './queries/5E-API/class/getSpellcastingClasses';
import GET_LANGUAGES from './queries/5E-API/languages/getLanguages';

const client = createClient({ url: 'https://www.dnd5eapi.co/graphql' });

const query = async <
	TResponse,
	TVariables extends { [prop: string]: any } = Record<string, unknown>
>(
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: TVariables
) => await client.query<TResponse>(queryString, variables).toPromise();

export const getDamageTypes = async () =>
	(await query<{ damageTypes: SrdItem[] }>(GET_DAMAGE_TYPES)).data?.damageTypes;

export const getRaces = async () =>
	await query<{ races: SrdItem[] }>(GET_RACES);

export const getRace = async (index: string) =>
	await query<{ race: SrdFullRaceItem }, { index: string }>(GET_RACE, {
		index
	});

export const getClasses = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ classes: SrdItem[] }>(GET_CLASSES))?.data?.classes;

export const getSpellcastingClasses = async (): Promise<
	SrdItem[] | undefined
> =>
	(
		await query<{
			classes: (SrdItem & { spellcasting?: { level: number } })[];
		}>(GET_SPELLCASTING_CLASSES)
	)?.data?.classes
		.filter(({ spellcasting }) => !!spellcasting)
		.map<SrdItem>(klass => ({
			index: klass.index,
			name: klass.name
		}));

export const getClass = async (index: string) =>
	await query<{ class: SrdFullClassItem }, { index: string }>(GET_CLASS, {
		index
	});

export const getAbilities = async (): Promise<AbilityItem[] | undefined> =>
	(await query<{ abilityScores: AbilityItem[] }>(GET_ABILITIES))?.data
		?.abilityScores;

export const getEquipments = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ equipments: SrdItem[] }>(GET_EQUIPMENTS))?.data?.equipments;

export const getSubraces = async () =>
	await query<{ subraces: SrdSubraceItem[] }>(GET_SUBRACES);

export const getSubrace = async (index: string) =>
	await query<{ subrace: SrdFullSubraceItem }, { index: string }>(GET_SUBRACE, {
		index
	});

export const getLanguages = async () =>
	(await query<{ languages: SrdItem[] }>(GET_LANGUAGES)).data?.languages;

export const getMagicSchools = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ magicSchools: SrdItem[] }>(GET_MAGIC_SCHOOLS)).data
		?.magicSchools;

export const getProficienciesByType = async (
	type: ProficiencyType | ProficiencyType[]
) =>
	await query<
		{ proficiencies: SrdProficiencyItem[] },
		{ type: ProficiencyType | ProficiencyType[] }
	>(GET_PROFICIENCIES_BY_TYPE, {
		type
	});

export const getMonsterTypes = async () =>
	await query<
		{
			humanoids: { subtype: MonsterSubtype }[];
			monsters: { type: MonsterType }[];
		},
		{ type: MonsterType | MonsterType[] }
	>(GET_MONSTER_TYPES, { type: 'HUMANOID' });

export const getSpellsByClass = async (klass: string | string[]) =>
	await query<{ spells: SrdSpellItem[] }, { class: string | string[] }>(
		GET_SPELLS_BY_CLASS,
		{ class: klass }
	);
