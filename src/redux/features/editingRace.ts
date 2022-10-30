import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Item } from '../../types/db/item';
import Size from '../../types/size';

type TraitState = {
	name?: string;
	description?: string;
	proficiencies?: Item[];
	proficiencyOptions?: {
		choose?: number;
		options: Item[];
	};
	hpBonusPerLevel?: number | null;
	spellOptions?: {
		choose?: number;
		options: Item[];
	};
};

type TraitWithSubtraitState = TraitState & {
	subtraitOptions?: {
		choose?: number;
		options: TraitState[];
	};
};

export type EditingRaceState = {
	name: string;
	abilityBonuses: { bonus?: number; abilityScore?: Item }[];
	abilityBonusOptions?: {
		bonus?: number;
		numberOfAbilityScores?: number;
	};
	languages: Item[];
	numLanguageOptions?: number;
	size?: Size;
	speed?: number;
	traits: TraitWithSubtraitState[];
};

export const initialState: EditingRaceState = {
	name: '',
	abilityBonuses: [],
	languages: [],
	traits: []
};

const editingRaceSlice = createSlice({
	name: 'editingRace',
	initialState,
	reducers: {
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		},
		setSize: (state, { payload }: PayloadAction<Size | undefined>) => {
			state.size = payload;
		},
		setSpeed: (state, { payload }: PayloadAction<number | undefined>) => {
			state.speed = payload;
		},
		setLanguages: (state, { payload }: PayloadAction<Item[]>) => {
			state.languages = payload;
		},
		setNumLanguageOptions: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!payload) {
				delete state.numLanguageOptions;
			} else {
				state.numLanguageOptions = payload;
			}
		},
		addAbilityBonus: state => {
			state.abilityBonuses = [...state.abilityBonuses, {}];
		},
		removeAbilityBonus: (state, { payload }: PayloadAction<number>) => {
			state.abilityBonuses = state.abilityBonuses.filter(
				(val, index) => index !== payload
			);
		},
		setAbilityBonusBonus: (
			state,
			{
				payload: { index, bonus }
			}: PayloadAction<{ index: number; bonus?: number }>
		) => {
			while (index > state.abilityBonuses.length - 1) {
				state.abilityBonuses = [...state.abilityBonuses, {}];
			}

			state.abilityBonuses[index].bonus = bonus;
		},
		setAbilityBonusAbilityScore: (
			state,
			{
				payload: { index, abilityScore }
			}: PayloadAction<{ index: number; abilityScore?: Item }>
		) => {
			while (index > state.abilityBonuses.length - 1) {
				state.abilityBonuses = [...state.abilityBonuses, {}];
			}

			state.abilityBonuses[index].abilityScore = abilityScore;
		},
		addAbilityBonusOptions: state => {
			state.abilityBonusOptions = {};
		},
		setAbilityBonusOptionsBonus: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!state.abilityBonusOptions) {
				state.abilityBonusOptions = {};
			}

			state.abilityBonusOptions.bonus = payload;
		},
		setAbilityBonusOptionsNumberOfAbilityScores: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!state.abilityBonusOptions) {
				state.abilityBonusOptions = {};
			}

			state.abilityBonusOptions.numberOfAbilityScores = payload;
		},
		removeAbilityBonusOptions: state => {
			delete state.abilityBonusOptions;
		},
		addTrait: state => {
			state.traits = [...state.traits, {}];
		},
		removeTrait: (state, { payload }: PayloadAction<number>) => {
			state.traits = state.traits.filter((val, index) => index !== payload);
		},
		setTraitName: (
			state,
			{
				payload: { index, name }
			}: PayloadAction<{ index: number; name: string }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			state.traits[index].name = name;
		},
		setTraitDescription: (
			state,
			{
				payload: { index, description }
			}: PayloadAction<{ index: number; description: string }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			state.traits[index].description = description;
		},
		addTraitProficiencies: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].proficiencies = [];
		},
		removeTraitProficiencies: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].proficiencies;
		},
		addTraitProficiencyOptions: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].proficiencyOptions = { options: [] };
		},
		removeTraitProficiencyOptions: (
			state,
			{ payload }: PayloadAction<number>
		) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].proficiencyOptions;
		},
		addTraitHPBonus: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].hpBonusPerLevel = null;
		},
		removeTraitHPBonus: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].hpBonusPerLevel;
		},
		addTraitSpellOptions: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].spellOptions = { options: [] };
		},
		removeTraitSpellOptions: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].spellOptions;
		},
		addTraitSubtraits: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].subtraitOptions = { options: [] };
		},
		removeTraitSubtraits: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].subtraitOptions;
		}
	}
});

export const {
	setName,
	setSize,
	setSpeed,
	setLanguages,
	setNumLanguageOptions,
	addAbilityBonus,
	removeAbilityBonus,
	setAbilityBonusBonus,
	setAbilityBonusAbilityScore,
	addAbilityBonusOptions,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores,
	removeAbilityBonusOptions,
	addTrait,
	removeTrait,
	setTraitName,
	setTraitDescription,
	addTraitProficiencies,
	removeTraitProficiencies,
	addTraitProficiencyOptions,
	removeTraitProficiencyOptions,
	addTraitHPBonus,
	removeTraitHPBonus,
	addTraitSpellOptions,
	removeTraitSpellOptions,
	addTraitSubtraits,
	removeTraitSubtraits
} = editingRaceSlice.actions;

export default editingRaceSlice.reducer;
