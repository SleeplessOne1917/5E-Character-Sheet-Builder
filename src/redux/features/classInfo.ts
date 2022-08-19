import { SrdFeatureItem } from './../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdFullClassItem, SrdSubclassItem } from '../../types/srd';

import AbilityScores from '../../types/abilityScores';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
	subclass?: SrdSubclassItem;
	abilityBonuses: (AbilityScores | null)[][];
	featuresSubfeatures: { [key: string]: SrdFeatureItem[] };
};

type SetAbilityBonusPayload = {
	index: number;
	abilityScores: (AbilityScores | null)[];
};

export const initialState: ClassInfoState = {
	level: 1,
	abilityBonuses: [],
	featuresSubfeatures: {}
};

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
		},
		addFeatureSubfeature: (
			state,
			{
				payload: { feature, index }
			}: PayloadAction<{ index: string; feature: SrdFeatureItem }>
		) => {
			if (!state.featuresSubfeatures[index]) {
				state.featuresSubfeatures[index] = [];
			}

			state.featuresSubfeatures[index] = [
				...state.featuresSubfeatures[index],
				feature
			];
		},
		removeFeatureSubfeature: (
			state,
			{
				payload: { index, feature }
			}: PayloadAction<{ index: string; feature: string }>
		) => {
			if (!state.featuresSubfeatures[index]) {
				state.featuresSubfeatures[index] = [];
			}

			state.featuresSubfeatures[index] = state.featuresSubfeatures[
				index
			].filter(f => f.index !== feature);
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
	removeAbilityBonus,
	addFeatureSubfeature,
	removeFeatureSubfeature
} = classInfoSlice.actions;

export default classInfoSlice.reducer;
