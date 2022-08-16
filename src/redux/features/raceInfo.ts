import {
	AbilityBonus,
	SrdItem,
	SrdProficiencyItem,
	SrdSpellItem,
	SrdSubtraitItem
} from './../../types/srd';
import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdFullRaceItem, SrdFullSubraceItem } from '../../types/srd';

export type RaceInfoState = {
	race?: SrdFullRaceItem;
	subrace?: SrdFullSubraceItem;
	selectedAbilityScoreBonuses?: AbilityBonus[];
	selectedLanguages?: SrdItem[];
	selectedTraitProficiencies: { [key: string]: SrdProficiencyItem[] };
	selectedTraitLanguages: { [key: string]: SrdItem[] };
	selectedTraitSpells: { [key: string]: SrdSpellItem[] };
	draconicAncestry?: SrdSubtraitItem;
};

type SelectRacePayload = {
	race: SrdFullRaceItem;
	subrace?: SrdFullSubraceItem;
};

type SelectTraitProficienciesPayload = {
	index: string;
	proficiencies: SrdProficiencyItem[];
};

type SelectTraitLanguagesPayload = {
	index: string;
	languages: SrdItem[];
};

type SelectTraitSpellsPayload = {
	index: string;
	spells: SrdSpellItem[];
};

export const initialState: RaceInfoState = {
	selectedTraitProficiencies: {},
	selectedTraitLanguages: {},
	selectedTraitSpells: {}
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
		addRaceAbilityBonus: (state, action: PayloadAction<AbilityBonus>) => {
			if (!state.selectedAbilityScoreBonuses) {
				state.selectedAbilityScoreBonuses = [];
			}
			state.selectedAbilityScoreBonuses = [
				...state.selectedAbilityScoreBonuses,
				action.payload
			];
		},
		removeRaceAbilityBonus: (state, { payload }: PayloadAction<string>) => {
			if (!state.selectedAbilityScoreBonuses) {
				state.selectedAbilityScoreBonuses = [];
			} else {
				state.selectedAbilityScoreBonuses =
					state.selectedAbilityScoreBonuses.filter(
						bonus => bonus.ability_score.index !== payload
					);
			}
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
		},
		selectTraitSpells: (
			state,
			action: PayloadAction<SelectTraitSpellsPayload>
		) => {
			const { index, spells } = action.payload;
			(
				state.selectedTraitSpells as Draft<{
					[key: string]: SrdSpellItem[];
				}>
			)[index] = spells;
		},
		deselectTraitSpells: (state, { payload }: PayloadAction<string>) => {
			delete (
				state.selectedTraitSpells as Draft<{
					[key: string]: SrdSpellItem[];
				}>
			)[payload];
		}
	}
});

export const {
	selectRace,
	deselectRace,
	addRaceAbilityBonus,
	removeRaceAbilityBonus,
	selectLanguages,
	deselectLanguages,
	selectTraitProficiencies,
	deselectTraitProficiencies,
	selectTraitLanguages,
	deselectTraitLanguages,
	selectDraconicAncestry,
	deselectDraconicAncestry,
	selectTraitSpells,
	deselectTraitSpells
} = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
