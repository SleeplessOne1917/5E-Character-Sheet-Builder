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
	abilityImprovement: number;
	miscBonus?: number | null;
	otherBonus?: number | null;
	override?: number | null;
};

export type AbilityPayload = {
	value: number | null;
	abilityIndex: AbilityScores;
};

export const initialState: AbilityScoresState = {
	str: { abilityImprovement: 0 },
	dex: { abilityImprovement: 0 },
	con: { abilityImprovement: 0 },
	int: { abilityImprovement: 0 },
	wis: { abilityImprovement: 0 },
	cha: { abilityImprovement: 0 }
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
		},
		updateRaceBonus: (state, action: PayloadAction<AbilityPayload>) => {
			const { value, abilityIndex } = action.payload;
			state[abilityIndex].raceBonus = value;
		},
		incrementAbilityBonus: (
			state,
			{ payload }: PayloadAction<AbilityScores>
		) => {
			++state[payload].abilityImprovement;
		},
		decrementAbilityBonus: (
			state,
			{ payload }: PayloadAction<AbilityScores>
		) => {
			--state[payload].abilityImprovement;
		}
	}
});

export const {
	updateBase,
	updateOtherBonus,
	updateOverride,
	updateRaceBonus,
	incrementAbilityBonus,
	decrementAbilityBonus
} = abilityScoresSlice.actions;
export default abilityScoresSlice.reducer;
