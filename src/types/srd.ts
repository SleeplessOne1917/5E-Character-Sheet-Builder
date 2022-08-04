export type SrdItem = {
	index: string;
	name: string;
};

export type AbilityItem = {
	index: string;
	full_name: string;
};

export type SrdSubraceItem = {
	index: string;
	name: string;
	race: {
		index: string;
	};
};

export type SrdTrait = {
	index: string;
	name: string;
	desc: string[];
	proficiencies: SrdItem[];
	proficiency_choices?: {
		choose: number;
		from: { options: { item: SrdItem }[] };
	};
};

export type AbilityBonus = {
	ability_score: { index: string; full_name: string };
	bonus: number;
};

export type SrdRace = {
	index: string;
	name: string;
	size: string;
	age: string;
	size_description: string;
	alignment: string;
	language_desc: string;
	speed: number;
	languages: SrdItem[];
	language_options?: {
		choose: number;
		from: { options: { item: SrdItem }[] };
	};
	ability_bonuses: AbilityBonus[];
	ability_bonus_options?: {
		choose: number;
		from: {
			options: AbilityBonus[];
		};
	};
	traits: SrdTrait[];
};

export type SrdSubrace = {
	index: string;
	name: string;
	desc: string;
	ability_bonuses: AbilityBonus[];
	racial_traits: SrdTrait[];
};
