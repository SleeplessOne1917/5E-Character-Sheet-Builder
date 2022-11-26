import { Spell, SpellItem } from '../types/characterSheetBuilderAPI';
import { SrdSpell, SrdSpellItem } from '../types/srd';
import {
	getSpell as getCharacterSheetBuilderSpell,
	getSpells as getCharacterSheetBuilderSpells,
	getSpellsByClass as getCharacterSheetBuilderSpellsByClass
} from '../graphql/characterSheetBuilderClientService';
import {
	getSpell as getSrdSpell,
	getSpells as getSrdSpells,
	getSpellsByClass as getSrdSpellsByClass
} from '../graphql/srdClientService';

import { Client } from 'urql/core';
import { getMarkdownFromStringArray } from './markdownStringArrayToStringService';
import { isObjectId } from './objectIdService';

export const mapSpell = (spell: SrdSpell): Spell =>
	Object.entries({
		id: spell.index,
		name: spell.name,
		castingTime: spell.casting_time,
		classes: spell.classes.map(klass => ({
			id: klass.index,
			name: klass.name
		})),
		components: spell.components,
		concentration: spell.concentration,
		ritual: spell.ritual,
		description: getMarkdownFromStringArray(spell.desc),
		duration: spell.duration,
		level: spell.level,
		range: spell.range,
		school: {
			id: spell.school.index,
			name: spell.school.name
		},
		atHigherLevels: spell.higher_level
			? getMarkdownFromStringArray(spell.higher_level)
			: undefined,
		material: spell.material,
		damageType:
			spell.damage && spell.damage.damage_type
				? {
						id: spell.damage.damage_type.index,
						name: spell.damage.damage_type.name
				  }
				: undefined
	}).reduce(
		(acc, [key, val]) => (val || val === 0 ? { ...acc, [key]: val } : acc),
		{} as Spell
	);

export const mapSpellItem = ({
	index,
	name,
	level,
	school
}: SrdSpellItem): SpellItem => ({
	id: index,
	name: name,
	level: level,
	school: {
		id: school.index,
		name: school.name
	}
});

export const getSpell = async (id: string, client?: Client) => {
	if (isObjectId(id)) {
		return (await getCharacterSheetBuilderSpell(id, client))?.data?.spell;
	}

	const spell = (await getSrdSpell(id)).data?.spell;

	return spell ? mapSpell(spell) : undefined;
};

const combineSpellArrays = ({
	srdSpells,
	characterSheetBuilderSpells
}: {
	srdSpells?: SpellItem[];
	characterSheetBuilderSpells?: SpellItem[];
}) =>
	(srdSpells ?? []).concat(characterSheetBuilderSpells ?? []).sort((a, b) => {
		const val = a.level - b.level;

		return val === 0 ? a.name.localeCompare(b.name) : val;
	});

export const getSpellsByClass = async (klass: string) => {
	const srdSpells = (
		await getSrdSpellsByClass(klass)
	).data?.spells?.map<SpellItem>(mapSpellItem);

	const characterSheetBuilderSpells = (
		await getCharacterSheetBuilderSpellsByClass(klass)
	).data?.spells;

	return combineSpellArrays({ srdSpells, characterSheetBuilderSpells });
};

export const getSpells = async () => {
	const srdSpells = (await getSrdSpells()).data?.spells?.map<SpellItem>(
		mapSpellItem
	);

	const characterSheetBuilderSpells = (await getCharacterSheetBuilderSpells())
		.data?.spells;

	return combineSpellArrays({ srdSpells, characterSheetBuilderSpells });
};
