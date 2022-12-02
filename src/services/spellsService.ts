import { Spell, SpellItem } from '../types/characterSheetBuilderAPI';
import { SrdSpell, SrdSpellItem } from '../types/srd';

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

export const mapSpellItem = (spell: SrdSpellItem): SpellItem => ({
	id: spell.index,
	level: spell.level,
	name: spell.name,
	school: {
		id: spell.school.index,
		name: spell.school.name
	}
});

export const combineSpellArrays = (
	...spellLists: (SpellItem[] | undefined)[]
) =>
	spellLists
		.reduce((acc: SpellItem[], cur) => [...acc, ...(cur ?? [])], [])
		.sort((a, b) => {
			const val = a.level - b.level;

			return val === 0 ? a.name.localeCompare(b.name) : val;
		});
