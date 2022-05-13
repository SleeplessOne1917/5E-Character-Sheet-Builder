export type SrdItem = {
	index: string;
	name: string;
};

export type AbilityItem = {
	index: string;
	full_name: string;
};

export type SubraceItem = {
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
};

export type SrdRace = {
	index: string;
	name: string;
	size: string;
	age: string;
	size_description: string;
	alignment: string;
	language_desc: string;
	ability_bonuses: { ability_score: { index: string }; bonus: number }[];
	traits: SrdTrait[];
};

export type SrdSubrace = {
	index: string;
	name: string;
	desc: string;
};
