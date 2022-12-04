import { Item } from '../types/db/item';
import { SrdTrait } from '../types/srd';
import Trait from '../types/trait';
import { getMarkdownFromStringArray } from './markdownStringArrayToStringService';

const mapTrait = (srdTrait: SrdTrait): Trait => ({
	uuid: srdTrait.index,
	description: getMarkdownFromStringArray(srdTrait.desc),
	name: srdTrait.name,
	...(srdTrait.proficiencies
		? {
				proficiencies: srdTrait.proficiencies.map<Item>(({ index, name }) => ({
					id: index,
					name
				}))
		  }
		: {}),
	...(srdTrait.proficiency_choices
		? {
				proficiencyOptions: {
					choose: srdTrait.proficiency_choices.choose,
					options: srdTrait.proficiency_choices.from.options.map<Item>(
						({ item }) => ({ id: item?.index ?? '', name: item?.name ?? '' })
					)
				}
		  }
		: {}),
	...(srdTrait.index === 'infernal-legacy'
		? { spells: [{ id: 'thaumaturgy', name: 'Thaumaturgy' }] }
		: {}),
	...(srdTrait.trait_specific?.spell_options
		? {
				spellOptions: {
					choose: srdTrait.trait_specific.spell_options.choose,
					options: srdTrait.trait_specific.spell_options.from.options.map<Item>(
						({ item: { index, name } }) => ({ id: index, name })
					)
				}
		  }
		: {}),
	...(srdTrait.index === 'dwarven-toughness' ? { hpBonusPerLevel: 1 } : {})
});

export default mapTrait;
