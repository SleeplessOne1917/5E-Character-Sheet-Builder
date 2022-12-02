import { Spell } from '../types/characterSheetBuilderAPI';
import { SrdSpell } from '../types/srd';
import { getMarkdownFromStringArray } from './markdownStringArrayToStringService';
import { getSpell as getSrdSpell } from '../server/5E-API/srdClientService';
import { isObjectId } from './objectIdService';
import { trpc } from '../common/trpcProxyClient';

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

export const getSpell = async (id: string) =>
	isObjectId(id)
		? await trpc.spells.spell.query(id)
		: mapSpell((await getSrdSpell(id)).data?.spell as SrdSpell);
