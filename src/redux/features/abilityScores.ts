import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../types/abilityScores';
import { AppReducers } from '../../types/redux';

export type AbilityScoresState = {
	str: AbilityScore;
	dex: AbilityScore;
	con: AbilityScore;
	int: AbilityScore;
	wis: AbilityScore;
	cha: AbilityScore;
};

export type AbilityScore = {
	base?: number | null;
	raceBonus?: number | null;
	abilityImprovement: number;
	miscBonus?: number | null;
	otherBonus?: number | null;
	override?: number | null;
	highest: number;
};

export type AbilityPayload = {
	value: number | null;
	abilityIndex: AbilityScores;
};

export const initialState: AbilityScoresState = {
	str: { abilityImprovement: 0, highest: 20 },
	dex: { abilityImprovement: 0, highest: 20 },
	con: { abilityImprovement: 0, highest: 20 },
	int: { abilityImprovement: 0, highest: 20 },
	wis: { abilityImprovement: 0, highest: 20 },
	cha: { abilityImprovement: 0, highest: 20 }
};

export const reducers: AppReducers<AbilityScoresState> = {
	updateBase: (state, action: PayloadAction<AbilityPayload>) => {
		const { value, abilityIndex } = action.payload;
		state[abilityIndex].base = value;
	},
	updateOtherBonus: (state, action: PayloadAction<AbilityPayload>) => {
		const { value, abilityIndex } = action.payload;
		state[abilityIndex].otherBonus = value;
	},
	updateOverride: (state, action: PayloadAction<AbilityPayload>) => {
		const { value, abilityIndex } = action.payload;
		state[abilityIndex].override = value;
	},
	updateRaceBonus: (state, action: PayloadAction<AbilityPayload>) => {
		const { value, abilityIndex } = action.payload;
		state[abilityIndex].raceBonus = value;
	},
	incrementAbilityBonus: (state, { payload }: PayloadAction<AbilityScores>) => {
		++state[payload].abilityImprovement;
	},
	decrementAbilityBonus: (state, { payload }: PayloadAction<AbilityScores>) => {
		--state[payload].abilityImprovement;
	},
	setAbilityHighest: (
		state,
		{ payload: { abilityIndex, value } }: PayloadAction<AbilityPayload>
	) => {
		state[abilityIndex].highest = value as number;
	},
	resetAbilityHighest: (state, { payload }: PayloadAction<AbilityScores>) => {
		state[payload].highest = 20;
	},
	updateMiscBonus: (
		state,
		{ payload: { abilityIndex, value } }: PayloadAction<AbilityPayload>
	) => {
		state[abilityIndex].miscBonus = value;
	}
};

const abilityScoresSlice = createSlice({
	name: 'abilityScores',
	initialState,
	reducers
});

export const {
	updateBase,
	updateOtherBonus,
	updateOverride,
	updateRaceBonus,
	incrementAbilityBonus,
	decrementAbilityBonus,
	setAbilityHighest,
	resetAbilityHighest,
	updateMiscBonus
} = abilityScoresSlice.actions;
export default abilityScoresSlice.reducer;
