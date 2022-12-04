import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import Size from '../../types/size';
import { TraitWithSubtraitsState } from './editingRace';

/* eslint-disable @typescript-eslint/ban-ts-comment */

type EditingSubraceStateOverrides = {
	abilityBonuses?: boolean;
	abilityBonusOptions?: boolean;
	languages?: boolean;
	numberOfLanguageOptions?: boolean;
	size?: boolean;
	speed?: boolean;
};

export type EditingSubraceState = {
	name: string;
	abilityBonuses?: { bonus?: number; abilityScore?: Item }[];
	abilityBonusOptions?: {
		bonus?: number;
		numberOfAbilityScores?: number;
	};
	languages?: Item[];
	numberOfLanguageOptions?: number;
	size?: Size;
	speed?: number;
	traits: TraitWithSubtraitsState[];
	overrides?: EditingSubraceStateOverrides;
	omittedRaceTraits?: string[];
	race?: Item;
};

export const initialState: EditingSubraceState = {
	name: '',
	traits: []
};

const prepOverrides = (state: Draft<EditingSubraceState>) => {
	if (!state.overrides) {
		state.overrides = {};
	}
};

const prepAbilityBonuses = (
	state: Draft<EditingSubraceState>,
	index: number
) => {
	if (!state.abilityBonuses) {
		state.abilityBonuses = [];
	}

	while (index > state.abilityBonuses.length - 1) {
		state.abilityBonuses = [...state.abilityBonuses, {}];
	}
};

const editingSubraceSlice = createSlice({
	name: 'editingSubrace',
	initialState,
	reducers: {
		resetSubrace: () => initialState,
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		},
		setOverridesAbilityBonuses: (
			state,
			{ payload }: PayloadAction<boolean>
		) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.abilityBonuses = payload;
		},
		setOverridesAbilityBonusOptions: (
			state,
			{ payload }: PayloadAction<boolean>
		) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.abilityBonusOptions = payload;
		},
		setOverridesLanguages: (state, { payload }: PayloadAction<boolean>) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.languages = payload;
		},
		setOverridesNumberOfLanguageOptions: (
			state,
			{ payload }: PayloadAction<boolean>
		) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.numberOfLanguageOptions = payload;
		},
		setOverridesSize: (state, { payload }: PayloadAction<boolean>) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.size = payload;
		},
		setOverridesSpeed: (state, { payload }: PayloadAction<boolean>) => {
			prepOverrides(state);

			// @ts-ignore
			state.overrides.speed = payload;
		},
		setRace: (state, { payload }: PayloadAction<Item | undefined>) => {
			state.race = payload;
		},
		removeAbilityBonus: (state, { payload }: PayloadAction<number>) => {
			state.abilityBonuses = state.abilityBonuses?.filter(
				(v, i) => i !== payload
			);
		},
		setAbilityBonusAbilityScore: (
			state,
			{
				payload: { index, abilityScore }
			}: PayloadAction<{ index: number; abilityScore?: Item }>
		) => {
			prepAbilityBonuses(state, index);

			// @ts-ignore
			state.abilityBonuses[index].abilityScore = abilityScore;
		},
		setAbilityBonusBonus: (
			state,
			{
				payload: { index, bonus }
			}: PayloadAction<{ index: number; bonus?: number }>
		) => {
			prepAbilityBonuses(state, index);

			// @ts-ignore
			state.abilityBonuses[index].bonus = bonus;
		},
		addAbilityBonus: state => {
			state.abilityBonuses = [...(state.abilityBonuses ?? []), {}];
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
		addAbilityBonusOptions: state => {
			state.abilityBonusOptions = {};
		},
		removeAbilityBonusOptions: state => {
			delete state.abilityBonusOptions;
		},
		setSize: (state, { payload }: PayloadAction<Size | undefined>) => {
			state.size = payload;
		},
		setSpeed: (state, { payload }: PayloadAction<number | undefined>) => {
			state.speed = payload;
		},
		setLanguages: (state, { payload }: PayloadAction<Item[] | undefined>) => {
			state.languages = payload;
		},
		setNumberOfLanguageOptions: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!payload) {
				delete state.numberOfLanguageOptions;
			} else {
				state.numberOfLanguageOptions = payload;
			}
		}
	}
});

export const {
	resetSubrace,
	setName,
	setOverridesAbilityBonuses,
	setOverridesAbilityBonusOptions,
	setOverridesLanguages,
	setOverridesNumberOfLanguageOptions,
	setOverridesSize,
	setOverridesSpeed,
	setRace,
	removeAbilityBonus,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	addAbilityBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores,
	addAbilityBonusOptions,
	removeAbilityBonusOptions,
	setSize,
	setSpeed,
	setLanguages,
	setNumberOfLanguageOptions
} = editingSubraceSlice.actions;

export default editingSubraceSlice.reducer;
