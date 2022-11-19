import {
	getSpells as getSrdSpells,
	getSpellsByClass as getSrdSpellsByClass
} from '../graphql/srdClientService';

import { Spell } from '../types/characterSheetBuilderAPI';
import { SrdSpellItem } from '../types/srd';
import { getMarkdownFromStringArray } from './markdownStringArrayToStringService';

export const mapSpell = (spell: SrdSpellItem): Spell => ({
	id: spell.index,
	name: spell.name,
	castingTime: spell.casting_time,
	classes: spell.classes.map(klass => ({ id: klass.index, name: klass.name })),
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
});

export const getSpellsByClass = async (klass: string | string[]) => {
	const spells = (await getSrdSpellsByClass(klass)).data?.spells;

	return spells?.map<Spell>(mapSpell);
};

export const getSpells = async () => {
	const spells = (await getSrdSpells()).data?.spells;

	return spells?.map<Spell>(mapSpell);
};
