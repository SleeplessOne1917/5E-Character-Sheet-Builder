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

type SrdProficiencyItemChoiceOption = {
	item?: SrdProficiencyItem;
	choice?: {
		choose: number;
		from: {
			options: SrdProficiencyItemChoiceOption[];
		};
	};
};

export type SrdProficiencyItemChoice = {
	choose: number;
	desc?: string;
	from: { options: SrdProficiencyItemChoiceOption[] };
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

type AreaOfEffect = {
	size: number;
	type: 'SPHERE' | 'CUBE' | 'CYLINDER' | 'LINE' | 'CONE';
};

export type BreathWeapon = {
	damage: {
		damage_type: SrdItem;
		damage_at_character_level: { damage: string; level: number }[];
	}[];
	dc: {
		type: AbilityItem;
	};
	area_of_effect: AreaOfEffect;
};

type SpellComponent = 'V' | 'S' | 'M';

export interface SrdSpellItem extends SrdItem {
	level: number;
	components: SpellComponent[];
	casting_time: string;
	concentration: boolean;
	desc: string[];
	school: SrdItem;
	damage?: {
		damage_type: SrdItem;
	};
	material?: string;
	range: string;
	ritual: boolean;
}

export type SrdSpellItemChoice = {
	choose: number;
	from: {
		options: { item: SrdSpellItem }[];
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
		spell_options?: SrdSpellItemChoice;
	};
};

export type AbilityBonus = {
	ability_score: AbilityItem;
	bonus: number;
};

export interface SrdFullRaceItem extends SrdItem {
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
}

export interface SrdFullSubraceItem extends SrdItem {
	desc: string;
	ability_bonuses: AbilityBonus[];
	racial_traits: SrdTrait[];
}

export interface SrdFeatureItem extends SrdItem {
	desc: string[];
}

type ClassSpellcasting = {
	spellcasting_ability: AbilityItem;
	level: number;
	info: { name: string; desc: string[] }[];
};

type ClassLevelSpellcasting = {
	cantrips_known?: number;
	spell_slots_level_1?: number;
	spell_slots_level_2?: number;
	spell_slots_level_3?: number;
	spell_slots_level_4?: number;
	spell_slots_level_5?: number;
	spell_slots_level_6?: number;
	spell_slots_level_7?: number;
	spell_slots_level_8?: number;
	spell_slots_level_9?: number;
	spells_known?: number;
};

type Dice = {
	dice_count: number;
	dice_value: number;
};

export type ClassLevel = {
	prof_bonus: number;
	level: number;
	features: SrdFeatureItem[];
	spellcasting?: ClassLevelSpellcasting;
	subclass?: SrdItem;
	ability_score_bonuses: number;
	class_specific?: {
		rage_count?: number;
		rage_damage_bonus?: number;
		martial_arts?: Dice;
		ki_points?: number;
		unarmored_movement?: number;
		sneak_attack?: Dice;
		sorcery_points?: number;
		invocations_known?: number;
	};
};

interface SrdEquipmentItem extends SrdItem {
	contents?: { quantity: number; item: SrdItem }[];
}

type SrdEquipmentCategoryChoiceOption = {
	choice: {
		choose: number;
		from: { equipment_category: SrdItem };
	};
};

type SrdCountedReferenceOption = {
	count: number;
	of: SrdEquipmentItem;
	prerequisites: { type: string; proficiency: SrdProficiencyItem }[];
};

type SrdStartingEquipmentMultipleOption = {
	items: (SrdCountedReferenceOption | SrdEquipmentCategoryChoiceOption)[];
};

type SrdStartingEquipmentChoice = {
	choose: number;
	desc?: string;
	from: {
		equipment_category?: SrdItem;
		options?: (
			| SrdCountedReferenceOption
			| SrdEquipmentCategoryChoiceOption
			| SrdStartingEquipmentMultipleOption
		)[];
	};
};

export interface SrdSubclassItem extends SrdItem {
	subclass_flavor: string;
	desc: string[];
	spells: {
		prerequisites: { level?: number; index?: string; name?: string }[];
		spell: SrdSpellItem;
	}[];
	subclass_levels: { level: number; features: SrdFeatureItem[] }[];
}

export interface SrdFullClassItem extends SrdItem {
	hit_die: number;
	proficiencies: SrdProficiencyItem[];
	saving_throws: AbilityItem[];
	spellcasting?: ClassSpellcasting;
	starting_equipment: { quantity: number; equipment: SrdEquipmentItem }[];
	class_levels: ClassLevel[];
	proficiency_choices: SrdProficiencyItemChoice[];
	starting_equipment_options: SrdStartingEquipmentChoice[];
	subclasses: SrdSubclassItem[];
}
