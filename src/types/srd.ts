import AbilityScores from './abilityScores';

export interface SrdItem {
	index: string;
	name: string;
}

export type ProficiencyType =
	| 'WEAPONS'
	| 'ARTISANS_TOOLS'
	| 'SKILLS'
	| 'ARMOR'
	| 'MUSICAL_INSTRUMENTS'
	| 'SAVING_THROWS'
	| 'OTHER'
	| 'GAMING_SETS'
	| 'VEHICLES';

export interface SrdProficiencyItem extends SrdItem {
	type: ProficiencyType;
}

export type AbilityItem = {
	index: AbilityScores;
	full_name: string;
};

export interface SrdSubraceItem extends SrdItem {
	race: {
		index: string;
	};
}

export type SrdItemChoice = {
	choose: number;
	from: { options: { item: SrdItem }[] };
};

export type SrdProficiencyItemChoice = {
	choose: number;
	from: { options: { item: SrdProficiencyItem }[] };
};

export interface SrdSubtraitItem extends SrdItem {
	trait_specific: { breath_weapon: BreathWeapon };
}

export type SrdSubtraitItemChoice = {
	choose: number;
	from: {
		options: { item: SrdSubtraitItem }[];
	};
};

export type AbilityBonusChoice = {
	choose: number;
	from: {
		options: AbilityBonus[];
	};
};

export type BreathWeapon = {
	damage: {
		damage_type: SrdItem;
		damage_at_character_level: { damage: string; level: number }[];
	}[];
	dc: {
		type: AbilityItem;
	};
};

export type SrdTrait = {
	index: string;
	name: string;
	desc: string[];
	proficiencies: SrdProficiencyItem[];
	proficiency_choices?: SrdProficiencyItemChoice;
	language_options?: SrdItemChoice;
	trait_specific?: {
		subtrait_options?: SrdSubtraitItemChoice;
	};
};

export type AbilityBonus = {
	ability_score: AbilityItem;
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
	language_options?: SrdItemChoice;
	ability_bonuses: AbilityBonus[];
	ability_bonus_options?: AbilityBonusChoice;
	traits: SrdTrait[];
};

export type SrdSubrace = {
	index: string;
	name: string;
	desc: string;
	ability_bonuses: AbilityBonus[];
	racial_traits: SrdTrait[];
};
