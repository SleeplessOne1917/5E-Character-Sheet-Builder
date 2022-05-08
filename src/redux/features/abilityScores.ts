import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../types/abilityScores';

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
	abilityImprovement?: number | null;
	miscBonus?: number | null;
	otherBonus?: number | null;
	override?: number | null;
};

type AbilityPayload = {
	value: number | null;
	abilityIndex: AbilityScores;
};

export const initialState: AbilityScoresState = {
	str: {},
	dex: {},
	con: {},
	int: {},
	wis: {},
	cha: {}
};

const abilityScoresSlice = createSlice({
	name: 'abilityScores',
	initialState,
	reducers: {
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
		}
	}
});

export const { updateBase, updateOtherBonus, updateOverride } =
	abilityScoresSlice.actions;
export default abilityScoresSlice.reducer;
