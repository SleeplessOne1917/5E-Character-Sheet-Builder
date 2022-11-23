import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import Size from '../../types/size';

export type TraitState = {
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
	spells?: Item[];
};

/* eslint-disable @typescript-eslint/ban-ts-comment*/

export type TraitWithSubtraitsState = TraitState & {
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
	traits: TraitWithSubtraitsState[];
};

export const initialState: EditingRaceState = {
	name: '',
	abilityBonuses: [],
	languages: [],
	traits: []
};

const prepStateForSubtrait = ({
	state,
	parentIndex,
	index
}: {
	state: Draft<EditingRaceState>;
	parentIndex: number;
	index: number;
}) => {
	while (parentIndex > state.traits.length - 1) {
		state.traits = [...state.traits, {}];
	}

	if (!state.traits[parentIndex].subtraitOptions) {
		state.traits[parentIndex].subtraitOptions = { options: [] };
	}

	while (
		index > (state.traits[parentIndex].subtraitOptions?.options ?? []).length
	) {
		// @ts-ignore
		state.traits[parentIndex].subtraitOptions.options = [
			...(state.traits[parentIndex].subtraitOptions?.options ?? []),
			{}
		];
	}
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
		setTraitProficiencies: (
			state,
			{
				payload: { index, proficiencies }
			}: PayloadAction<{ index: number; proficiencies: Item[] }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[index].proficiencies = proficiencies;
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
		setTraitProficiencyOptionsChoose: (
			state,
			{
				payload: { index, choose }
			}: PayloadAction<{ index: number; choose?: number }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[index].proficiencyOptions) {
				state.traits[index].proficiencyOptions = { choose, options: [] };
			} else {
				// @ts-ignore
				state.traits[index].proficiencyOptions.choose = choose;
			}
		},
		setTraitProficiencyOptionsOptions: (
			state,
			{
				payload: { index, options }
			}: PayloadAction<{ index: number; options: Item[] }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[index].proficiencyOptions) {
				state.traits[index].proficiencyOptions = { options };
			} else {
				// @ts-ignore
				state.traits[index].proficiencyOptions.options = options;
			}
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
		setTraitHPBonus: (
			state,
			{
				payload: { index, hpBonus }
			}: PayloadAction<{ index: number; hpBonus: number | null }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[index].hpBonusPerLevel = hpBonus;
		},
		addTraitSpellOptions: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].spellOptions = { options: [] };
		},
		setTraitSpellOptionsChoose: (
			state,
			{
				payload: { index, choose }
			}: PayloadAction<{ index: number; choose?: number }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[index].spellOptions) {
				state.traits[index].spellOptions = { options: [] };
			}

			// @ts-ignore
			state.traits[index].spellOptions.choose = choose;
		},
		setTraitSpellOptionsOptions: (
			state,
			{
				payload: { index, options }
			}: PayloadAction<{ index: number; options: Item[] }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[index].spellOptions) {
				state.traits[index].spellOptions = { options: [] };
			}

			// @ts-ignore
			state.traits[index].spellOptions.options = options;
		},
		removeTraitSpellOptions: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].spellOptions;
		},
		addTraitSpells: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			state.traits[payload].spells = [];
		},
		removeTraitSpells: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}
			delete state.traits[payload].spells;
		},
		setTraitSpells: (
			state,
			{
				payload: { index, spells }
			}: PayloadAction<{ index: number; spells: Item[] }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			state.traits[index].spells = spells;
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
		},
		setSubtraitName: (
			state,
			{
				payload: { parentIndex, index, name }
			}: PayloadAction<{ parentIndex: number; index: number; name: string }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].name = name;
		},
		setSubtraitDescription: (
			state,
			{
				payload: { parentIndex, index, description }
			}: PayloadAction<{
				parentIndex: number;
				index: number;
				description: string;
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].description =
				description;
		},
		addSubtraitProficiencies: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].proficiencies =
				[];
		},
		removeSubtraitProficiencies: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			delete state.traits[parentIndex].subtraitOptions?.options[index]
				.proficiencies;
		},
		addSubtraitProficiencyOptions: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[
				index
			].proficiencyOptions = { options: [] };
		},
		removeSubtraitProficiencyOptions: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			delete state.traits[parentIndex].subtraitOptions?.options[index]
				.proficiencyOptions;
		},
		addSubtraitHPBonus: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].hpBonusPerLevel =
				null;
		},
		removeSubtraitHPBonus: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			delete state.traits[parentIndex].subtraitOptions?.options[index]
				.hpBonusPerLevel;
		},
		addSubtraitSpells: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].spells = [];
		},
		removeSubtraitSpells: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			delete state.traits[parentIndex].subtraitOptions?.options[index].spells;
		},
		addSubtraitSpellOptions: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].spellOptions = {
				options: []
			};
		},
		removeSubtraitSpellOptions: (
			state,
			{
				payload: { parentIndex, index }
			}: PayloadAction<{ parentIndex: number; index: number }>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			delete state.traits[parentIndex].subtraitOptions?.options[index]
				.spellOptions;
		},
		setSubtraitProficiencies: (
			state,
			{
				payload: { parentIndex, index, proficiencies }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				proficiencies: Item[];
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].proficiencies =
				proficiencies;
		},
		setSubtraitProficiencyOptionsChoose: (
			state,
			{
				payload: { parentIndex, index, choose }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				choose?: number;
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[
				index
			].proficiencyOptions.choose = choose;
		},
		setSubtraitProficiencyOptionsOptions: (
			state,
			{
				payload: { parentIndex, index, options }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				options?: Item[];
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[
				index
			].proficiencyOptions.options = options;
		},
		setSubtraitHPBonus: (
			state,
			{
				payload: { parentIndex, index, hpBonus }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				hpBonus: number | null;
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].hpBonusPerLevel =
				hpBonus;
		},
		setSubtraitSpells: (
			state,
			{
				payload: { parentIndex, index, spells }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				spells?: Item[];
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[index].spells = spells;
		},
		setSubtraitSpellOptionsChoose: (
			state,
			{
				payload: { parentIndex, index, choose }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				choose?: number;
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[
				index
			].spellOptions.choose = choose;
		},
		setSubtraitSpellOptionsOptions: (
			state,
			{
				payload: { parentIndex, index, options }
			}: PayloadAction<{
				index: number;
				parentIndex: number;
				options?: Item[];
			}>
		) => {
			prepStateForSubtrait({ state, parentIndex, index });

			// @ts-ignore
			state.traits[parentIndex].subtraitOptions.options[
				index
			].spellOptions.options = options;
		},
		setTraitSubtraitOptionsChoose: (
			state,
			{
				payload: { index, choose }
			}: PayloadAction<{ index: number; choose?: number }>
		) => {
			while (index > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[index].subtraitOptions) {
				state.traits[index].subtraitOptions = { options: [] };
			}

			// @ts-ignore
			state.traits[index].subtraitOptions.choose = choose;
		},
		addTraitSubtrait: (state, { payload }: PayloadAction<number>) => {
			while (payload > state.traits.length - 1) {
				state.traits = [...state.traits, {}];
			}

			if (!state.traits[payload].subtraitOptions) {
				state.traits[payload].subtraitOptions = { options: [] };
			}

			// @ts-ignore
			state.traits[payload].subtraitOptions.options = [
				// @ts-ignore
				...state.traits[payload].subtraitOptions.options,
				{}
			];
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
	setTraitProficiencies,
	addTraitProficiencyOptions,
	removeTraitProficiencyOptions,
	setTraitProficiencyOptionsChoose,
	setTraitProficiencyOptionsOptions,
	addTraitHPBonus,
	removeTraitHPBonus,
	setTraitHPBonus,
	addTraitSpellOptions,
	removeTraitSpellOptions,
	addTraitSubtraits,
	removeTraitSubtraits,
	addTraitSpells,
	removeTraitSpells,
	setTraitSpells,
	setTraitSpellOptionsChoose,
	setTraitSpellOptionsOptions,
	setSubtraitName,
	setSubtraitDescription,
	addSubtraitProficiencies,
	removeSubtraitProficiencies,
	addSubtraitProficiencyOptions,
	removeSubtraitProficiencyOptions,
	addSubtraitHPBonus,
	removeSubtraitHPBonus,
	addSubtraitSpells,
	removeSubtraitSpells,
	addSubtraitSpellOptions,
	removeSubtraitSpellOptions,
	setSubtraitProficiencies,
	setSubtraitProficiencyOptionsChoose,
	setSubtraitProficiencyOptionsOptions,
	setSubtraitHPBonus,
	setSubtraitSpells,
	setSubtraitSpellOptionsChoose,
	setSubtraitSpellOptionsOptions,
	setTraitSubtraitOptionsChoose,
	addTraitSubtrait
} = editingRaceSlice.actions;

export default editingRaceSlice.reducer;
