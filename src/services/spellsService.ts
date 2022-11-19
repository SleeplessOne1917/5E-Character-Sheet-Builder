import { Spell, SpellItem } from '../types/characterSheetBuilderAPI';
import { SrdSpell, SrdSpellItem } from '../types/srd';
import {
	getSpell as getSrdSpell,
	getSpells as getSrdSpells,
	getSpellsByClass as getSrdSpellsByClass
} from '../graphql/srdClientService';

import { getMarkdownFromStringArray } from './markdownStringArrayToStringService';

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

export const getSpell = async (index: string) => {
	const spell = (await getSrdSpell(index)).data?.spell;

	return spell ? mapSpell(spell) : undefined;
};

export const getSpellsByClass = async (klass: string | string[]) => {
	const spells = (await getSrdSpellsByClass(klass)).data?.spells;

	return spells?.map<SpellItem>(mapSpellItem);
};

export const getSpells = async () => {
	const spells = (await getSrdSpells()).data?.spells;

	return spells?.map<SpellItem>(mapSpellItem);
};
