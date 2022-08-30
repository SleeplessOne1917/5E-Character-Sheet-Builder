import {
	MonsterSubtype,
	MonsterType,
	SrdFeatureItem,
	SrdFullClassItem,
	SrdProficiencyItem,
	SrdSpellItem,
	SrdSubclassItem,
	Terrain
} from '../../types/srd';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import AbilityScores from '../../types/abilityScores';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
	subclass?: SrdSubclassItem;
	abilityBonuses: (AbilityScores | null)[][];
	featuresSubfeatures: { [key: string]: SrdFeatureItem[] };
	featuresProficiencies: { [key: string]: SrdProficiencyItem[] };
	favoredEnemies?: (MonsterType | MonsterSubtype | null)[][];
	favoredTerrains?: (Terrain | null)[];
	subclassSubType?: string | null;
	expertiseProficiencies?: (SrdProficiencyItem | null)[];
	spells?: SrdSpellItem[];
	subclassSpells?: SrdSpellItem[];
	proficiencies: (SrdProficiencyItem | null)[][];
};

type SetAbilityBonusPayload = {
	index: number;
	abilityScores: (AbilityScores | null)[];
};

export const initialState: ClassInfoState = {
	level: 1,
	abilityBonuses: [],
	featuresSubfeatures: {},
	featuresProficiencies: {},
	proficiencies: []
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
			}

			if (state.favoredEnemies.length < index + 1) {
				for (let i = 0; i <= index; ++i) {
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
			}

			if (state.favoredTerrains.length < index + 1) {
				for (let i = 0; i <= index; ++i) {
					state.favoredTerrains = [...state.favoredTerrains, null];
				}
			}

			state.favoredTerrains[index] = terrain;
		},
		selectSubclassSubtype: (
			state,
			{ payload }: PayloadAction<string | null>
		) => {
			state.subclassSubType = payload;
		},
		deselectSubclassSubtype: state => {
			delete state.subclassSubType;
		},
		addExpertiseProficiency: (
			state,
			{ payload }: PayloadAction<SrdProficiencyItem | null>
		) => {
			if (!state.expertiseProficiencies) {
				state.expertiseProficiencies = [];
			}

			state.expertiseProficiencies = [...state.expertiseProficiencies, payload];
		},
		removeExpertiseProficiency: state => {
			if (!state.expertiseProficiencies) {
				state.expertiseProficiencies = [];
			}

			state.expertiseProficiencies = state.expertiseProficiencies?.slice(0, -1);
		},
		setExpertiseProficiency: (
			state,
			{
				payload: { index, proficiency }
			}: PayloadAction<{
				index: number;
				proficiency: SrdProficiencyItem | null;
			}>
		) => {
			if (!state.expertiseProficiencies) {
				state.expertiseProficiencies = [];
			}

			if (state.expertiseProficiencies.length < index + 1) {
				for (let i = 0; i <= index; ++i) {
					state.expertiseProficiencies = [
						...state.expertiseProficiencies,
						null
					];
				}
			}

			state.expertiseProficiencies[index] = proficiency;
		},
		addClassSpell: (state, { payload }: PayloadAction<SrdSpellItem>) => {
			if (!state.spells) {
				state.spells = [];
			}

			state.spells = [...state.spells, payload];
		},
		removeClassSpell: (state, { payload }: PayloadAction<string>) => {
			if (!state.spells) {
				state.spells = [];
			}

			state.spells = state.spells.filter(spell => spell.index !== payload);
		},
		addSubclassSpell: (state, { payload }: PayloadAction<SrdSpellItem>) => {
			if (!state.subclassSpells) {
				state.subclassSpells = [];
			}

			state.subclassSpells = [...state.subclassSpells, payload];
		},
		removeSubclassSpell: (state, { payload }: PayloadAction<string>) => {
			if (!state.subclassSpells) {
				state.subclassSpells = [];
			}

			state.subclassSpells = state.subclassSpells.filter(
				spell => spell.index !== payload
			);
		},
		setClassProficiencies: (
			state,
			{
				payload: { proficiencies, index }
			}: PayloadAction<{
				proficiencies: (SrdProficiencyItem | null)[];
				index: number;
			}>
		) => {
			if (state.proficiencies.length < index + 1) {
				state.proficiencies = [...state.proficiencies, []];
			}

			state.proficiencies[index] = proficiencies;
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
	setFavoredTerrain,
	selectSubclassSubtype,
	deselectSubclassSubtype,
	addExpertiseProficiency,
	removeExpertiseProficiency,
	setExpertiseProficiency,
	addClassSpell,
	removeClassSpell,
	addSubclassSpell,
	removeSubclassSpell,
	setClassProficiencies
} = classInfoSlice.actions;

export default classInfoSlice.reducer;
