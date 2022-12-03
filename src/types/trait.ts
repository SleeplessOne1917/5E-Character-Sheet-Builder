import { Item } from './db/item';

type Trait = {
	uuid: string;
	name: string;
	description: string;
	proficiencies?: Item[];
	proficiencyOptions?: {
		choose: number;
		options: Item[];
	};
	hpBonusPerLevel?: number;
	spells?: Item[];
	spellOptions?: {
		choose: number;
		options: Item[];
	};
	subtraitOptions?: {
		choose: number;
		options: Omit<Trait, 'subtraitOptions'>[];
	};
};

export default Trait;
