import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdFullClassItem, SrdSubclassItem } from '../../types/srd';

import AbilityScores from '../../types/abilityScores';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
	subclass?: SrdSubclassItem;
	abilityBonuses: (AbilityScores | null)[][];
};

type SetAbilityBonusPayload = {
	index: number;
	abilityScores: (AbilityScores | null)[];
};

export const initialState: ClassInfoState = { level: 1, abilityBonuses: [] };

const classInfoSlice = createSlice({
	name: 'classInfo',
	initialState,
	reducers: {
		selectClass: (state, { payload }: PayloadAction<SrdFullClassItem>) => {
			state.class = payload;
		},
		deselectClass: () => initialState,
		setLevel: (state, { payload }: PayloadAction<number>) => {
			state.level = payload;
		},
		selectSubclass: (state, { payload }: PayloadAction<SrdSubclassItem>) => {
			state.subclass = payload;
		},
		deselectSubclass: state => {
			delete state.subclass;
		},
		addAbilityBonus: (
			state,
			{ payload }: PayloadAction<(AbilityScores | null)[]>
		) => {
			state.abilityBonuses = [...state.abilityBonuses, payload];
		},
		setAbilityBonus: (
			state,
			{
				payload: { abilityScores, index }
			}: PayloadAction<SetAbilityBonusPayload>
		) => {
			state.abilityBonuses[index] = abilityScores;
		},
		removeAbilityBonus: state => {
			state.abilityBonuses = state.abilityBonuses.slice(0, -1);
		}
	}
});

export const {
	selectClass,
	deselectClass,
	setLevel,
	selectSubclass,
	deselectSubclass,
	addAbilityBonus,
	setAbilityBonus,
	removeAbilityBonus
} = classInfoSlice.actions;

export default classInfoSlice.reducer;
