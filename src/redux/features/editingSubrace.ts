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

const initialState: EditingSubraceState = {
	name: '',
	traits: []
};

const prepOverrides = (state: Draft<EditingSubraceState>) => {
	if (!state.overrides) {
		state.overrides = {};
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
	setOverridesSpeed
} = editingSubraceSlice.actions;

export default editingSubraceSlice.reducer;
