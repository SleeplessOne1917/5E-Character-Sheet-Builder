import {
	MonsterSubtype,
	MonsterType,
	SrdFullClassItem,
	SrdProficiencyItem,
	SrdSubclassItem,
	Terrain
} from '../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../types/abilityScores';
import { SrdFeatureItem } from './../../types/srd';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
	subclass?: SrdSubclassItem;
	abilityBonuses: (AbilityScores | null)[][];
	featuresSubfeatures: { [key: string]: SrdFeatureItem[] };
	featuresProficiencies: { [key: string]: SrdProficiencyItem[] };
	favoredEnemies?: (MonsterType | MonsterSubtype | null)[][];
	favoredTerrains?: (Terrain | null)[];
};

type SetAbilityBonusPayload = {
	index: number;
	abilityScores: (AbilityScores | null)[];
};

export const initialState: ClassInfoState = {
	level: 1,
	abilityBonuses: [],
	featuresSubfeatures: {},
	featuresProficiencies: {}
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
		},
		addFeatureProficiency: (
			state,
			{
				payload: { index, proficiency }
			}: PayloadAction<{ index: string; proficiency: SrdProficiencyItem }>
		) => {
			if (!state.featuresProficiencies[index]) {
				state.featuresProficiencies[index] = [];
			}

			state.featuresProficiencies[index] = [
				...state.featuresProficiencies[index],
				proficiency
			];
		},
		removeFeatureProficiency: (
			state,
			{
				payload: { index, proficiency }
			}: PayloadAction<{ index: string; proficiency: string }>
		) => {
			if (!state.featuresProficiencies[index]) {
				state.featuresProficiencies[index] = [];
			}

			state.featuresProficiencies[index] = state.featuresProficiencies[
				index
			].filter(prof => prof.index !== proficiency);
		},
		addFavoredEnemies: (
			state,
			{ payload }: PayloadAction<(MonsterType | MonsterSubtype | null)[]>
		) => {
			if (!state.favoredEnemies) {
				state.favoredEnemies = [];
			}

			state.favoredEnemies = [...state.favoredEnemies, payload];
		},
		removeFavoredEnemies: state => {
			if (!state.favoredEnemies) {
				state.favoredEnemies = [];
			}

			state.favoredEnemies = state.favoredEnemies.slice(0, -1);
		},
		setFavoredEnemies: (
			state,
			{
				payload: { index, enemyTypes }
			}: PayloadAction<{
				index: number;
				enemyTypes: (MonsterType | MonsterSubtype | null)[];
			}>
		) => {
			if (!state.favoredEnemies) {
				state.favoredEnemies = [];

				for (let i = 0; i < index; ++i) {
					state.favoredEnemies = [...state.favoredEnemies, [null]];
				}
			}

			state.favoredEnemies[index] = enemyTypes;
		},
		addFavoredTerrain: (state, { payload }: PayloadAction<Terrain | null>) => {
			if (!state.favoredTerrains) {
				state.favoredTerrains = [];
			}

			state.favoredTerrains = [...state.favoredTerrains, payload];
		},
		removeFavoredTerrain: state => {
			if (!state.favoredTerrains) {
				state.favoredTerrains = [];
			}

			state.favoredTerrains = state.favoredTerrains.slice(0, -1);
		},
		setFavoredTerrain: (
			state,
			{
				payload: { index, terrain }
			}: PayloadAction<{ index: number; terrain: Terrain | null }>
		) => {
			if (!state.favoredTerrains) {
				state.favoredTerrains = [];

				for (let i = 0; i < index; ++i) {
					state.favoredTerrains = [...state.favoredTerrains, null];
				}
			}

			state.favoredTerrains[index] = terrain;
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
	removeFeatureSubfeature,
	addFeatureProficiency,
	removeFeatureProficiency,
	addFavoredEnemies,
	removeFavoredEnemies,
	setFavoredEnemies,
	addFavoredTerrain,
	removeFavoredTerrain,
	setFavoredTerrain
} = classInfoSlice.actions;

export default classInfoSlice.reducer;
