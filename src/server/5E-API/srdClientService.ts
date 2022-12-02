import {
	AbilityItem,
	MonsterSubtype,
	MonsterType,
	SrdFullRaceItem,
	SrdFullSubraceItem,
	SrdItem,
	SrdProficiencyItem,
	SrdSpell,
	SrdSpellItem,
	SrdSubraceItem
} from '../../types/srd';
import { ProficiencyType, SrdFullClassItem } from '../../types/srd';
import { TypedDocumentNode, createClient } from 'urql/core';

import { DocumentNode } from 'graphql';
import GET_ABILITIES from './queries/abilities/getAbilities';
import GET_CLASS from './queries/class/getClass';
import GET_CLASSES from './queries/class/getClasses';
import GET_DAMAGE_TYPES from './queries/damage-types/getDamageTypes';
import GET_EQUIPMENTS from './queries/equipment/getEquipments';
import GET_LANGUAGES from './queries/languages/getLanguages';
import GET_MAGIC_SCHOOLS from './queries/magic-schools/getMagicSchools';
import GET_MONSTER_TYPES from './queries/monsters/getMonsterTypes';
import GET_PROFICIENCIES_BY_TYPE from './queries/proficiencies/proficienciesByType';
import GET_RACE from './queries/race/getRace';
import GET_RACES from './queries/race/getRaces';
import GET_SPELLCASTING_CLASSES from './queries/class/getSpellcastingClasses';
import GET_SRD_SPELL from './queries/spells/getSrdSpell';
import GET_SRD_SPELLS from './queries/spells/getSrdSpells';
import GET_SUBRACE from './queries/subrace/getSubrace';
import GET_SUBRACES from './queries/subrace/getSubraces';

const client = createClient({
	url: 'https://www.dnd5eapi.co/graphql'
});

const query = async <
	TResponse,
	TVariables extends { [prop: string]: any } = Record<string, unknown>
>(
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: TVariables
) => await client?.query<TResponse>(queryString, variables).toPromise();

export const getDamageTypes = async () =>
	(await query<{ damageTypes: SrdItem[] }>(GET_DAMAGE_TYPES))?.data
		?.damageTypes;

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
	(await query<{ languages: SrdItem[] }>(GET_LANGUAGES))?.data?.languages;

export const getMagicSchools = async (): Promise<SrdItem[] | undefined> =>
	(await query<{ magicSchools: SrdItem[] }>(GET_MAGIC_SCHOOLS))?.data
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
		GET_SRD_SPELLS,
		{ class: klass }
	);

export const getSpells = async () =>
	await query<{ spells: SrdSpellItem[] }>(GET_SRD_SPELLS);

export const getSpell = async (index: string) =>
	await query<{ spell: SrdSpell }, { index: string }>(GET_SRD_SPELL, { index });
