import { AbilityBonus } from '../db/models/race';
import { Item } from '../types/db/item';
import { Race } from '../types/characterSheetBuilderAPI';
import { SrdFullRaceItem } from '../types/srd';
import Trait from '../types/trait';
import mapTrait from './traitMapper';

const mapRace = (srdRace: SrdFullRaceItem): Race => ({
	id: srdRace.index,
	name: srdRace.name,
	abilityBonuses: srdRace.ability_bonuses.map<AbilityBonus>(ab => ({
		bonus: ab.bonus,
		abilityScore: {
			id: ab.ability_score.index,
			name: ab.ability_score.full_name
		}
	})),
	languages: srdRace.languages.map<Item>(({ index, name }) => ({
		id: index,
		name
	})),
	size: srdRace.size,
	speed: srdRace.speed,
	...(srdRace.ability_bonus_options
		? {
				abilityBonusOptions: {
					bonus: srdRace.ability_bonus_options.choose,
					numberOfAbilityScores:
						srdRace.ability_bonus_options.from.options.length
				}
		  }
		: {}),
	...(srdRace.language_options
		? {
				numberOfLanguageOptions: srdRace.language_options.choose
		  }
		: {}),
	...(srdRace.traits ? { traits: srdRace.traits.map<Trait>(mapTrait) } : {})
});

export default mapRace;
