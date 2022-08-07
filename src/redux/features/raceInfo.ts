import {
	AbilityBonus,
	SrdItem,
	SrdProficiencyItem,
	SrdSubtraitItem
} from './../../types/srd';
import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdRace, SrdSubrace } from '../../types/srd';

export type RaceInfoState = {
	race?: SrdRace;
	subrace?: SrdSubrace;
	selectedAbilityScoreBonuses?: AbilityBonus[];
	selectedLanguages?: SrdItem[];
	selectedTraitProficiencies: { [key: string]: SrdProficiencyItem[] };
	selectedTraitLanguages: { [key: string]: SrdItem[] };
	draconicAncestry?: SrdSubtraitItem;
};

type SelectRacePayload = {
	race: SrdRace;
	subrace?: SrdSubrace;
};

type SelectTraitProficienciesPayload = {
	index: string;
	proficiencies: SrdProficiencyItem[];
};

type SelectTraitLanguagesPayload = {
	index: string;
	languages: SrdItem[];
};

export const initialState: RaceInfoState = {
	selectedTraitProficiencies: {},
	selectedTraitLanguages: {}
};

const raceInfoSlice = createSlice({
	name: 'raceInfo',
	initialState,
	reducers: {
		selectRace: (state, action: PayloadAction<SelectRacePayload>) => {
			const { race, subrace } = action.payload;
			state.race = race;

			if (subrace) {
				state.subrace = subrace;
			}
		},
		deselectRace: () => initialState,
		selectAbilityBonuses: (state, action: PayloadAction<AbilityBonus[]>) => {
			state.selectedAbilityScoreBonuses = action.payload;
		},
		deselectAbilityBonuses: state => {
			delete state.selectedAbilityScoreBonuses;
		},
		selectLanguages: (state, action: PayloadAction<SrdItem[]>) => {
			state.selectedLanguages = action.payload;
		},
		deselectLanguages: state => {
			delete state.selectedLanguages;
		},
		selectTraitProficiencies: (
			state,
			action: PayloadAction<SelectTraitProficienciesPayload>
		) => {
			const { index, proficiencies } = action.payload;
			(
				state.selectedTraitProficiencies as Draft<{
					[key: string]: SrdProficiencyItem[];
				}>
			)[index] = proficiencies;
		},
		deselectTraitProficiencies: (state, { payload }: PayloadAction<string>) => {
			delete (
				state.selectedTraitProficiencies as Draft<{
					[key: string]: SrdProficiencyItem[];
				}>
			)[payload];
		},
		selectTraitLanguages: (
			state,
			action: PayloadAction<SelectTraitLanguagesPayload>
		) => {
			const { index, languages } = action.payload;
			(
				state.selectedTraitLanguages as Draft<{
					[key: string]: SrdItem[];
				}>
			)[index] = languages;
		},
		deselectTraitLanguages: (state, { payload }: PayloadAction<string>) => {
			delete (
				state.selectedTraitLanguages as Draft<{
					[key: string]: SrdItem[];
				}>
			)[payload];
		},
		selectDraconicAncestry: (
			state,
			{ payload }: PayloadAction<SrdSubtraitItem>
		) => {
			state.draconicAncestry = payload;
		},
		deselectDraconicAncestry: state => {
			delete state.draconicAncestry;
		}
	}
});

export const {
	selectRace,
	deselectRace,
	selectAbilityBonuses,
	deselectAbilityBonuses,
	selectLanguages,
	deselectLanguages,
	selectTraitProficiencies,
	deselectTraitProficiencies,
	selectTraitLanguages,
	deselectTraitLanguages,
	selectDraconicAncestry,
	deselectDraconicAncestry
} = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
