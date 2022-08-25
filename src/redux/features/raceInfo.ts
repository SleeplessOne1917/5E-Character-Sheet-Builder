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
	selectedAbilityScoreBonuses?: (AbilityBonus | null)[];
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

type AddTraitProficiencyPayload = {
	index: string;
	proficiency: SrdProficiencyItem;
};

type AddTraitLanguagePayload = {
	index: string;
	language: SrdItem;
};

type AddTraitSpellPayload = {
	index: string;
	spell: SrdSpellItem;
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
		setRaceAbilityBonus: (
			state,
			{
				payload: { index, abilityBonus }
			}: PayloadAction<{ index: number; abilityBonus: AbilityBonus | null }>
		) => {
			if (!state.selectedAbilityScoreBonuses) {
				state.selectedAbilityScoreBonuses = [];
			}

			if (state.selectedAbilityScoreBonuses.length < index + 1) {
				for (let i = 0; i < index + 1; ++i) {
					state.selectedAbilityScoreBonuses = [
						...(state.selectedAbilityScoreBonuses as AbilityBonus[]),
						null
					];
				}
			}

			state.selectedAbilityScoreBonuses = (
				state.selectedAbilityScoreBonuses as AbilityBonus[]
			).map((bonus, i) => (i === index ? abilityBonus : bonus));
		},
		addRaceLanguage: (state, { payload }: PayloadAction<SrdItem>) => {
			if (!state.selectedLanguages) {
				state.selectedLanguages = [];
			}
			state.selectedLanguages = [...state.selectedLanguages, payload];
		},
		removeRaceLanguage: (state, { payload }: PayloadAction<string>) => {
			if (!state.selectedLanguages) {
				state.selectedLanguages = [];
			}
			state.selectedLanguages = state.selectedLanguages.filter(
				language => language.index !== payload
			);
		},
		addTraitProficiency: (
			state,
			action: PayloadAction<AddTraitProficiencyPayload>
		) => {
			const { index, proficiency } = action.payload;
			if (
				!(
					state.selectedTraitProficiencies as Draft<{
						[key: string]: SrdProficiencyItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitProficiencies as Draft<{
						[key: string]: SrdProficiencyItem[];
					}>
				)[index] = [];
			}
			(
				state.selectedTraitProficiencies as Draft<{
					[key: string]: SrdProficiencyItem[];
				}>
			)[index] = [
				...(
					state.selectedTraitProficiencies as Draft<{
						[key: string]: SrdProficiencyItem[];
					}>
				)[index],
				proficiency
			];
		},
		removeTraitProficiency: (
			state,
			{
				payload: { index, proficiency }
			}: PayloadAction<{ index: string; proficiency: string }>
		) => {
			if (
				!(
					state.selectedTraitProficiencies as Draft<{
						[key: string]: SrdProficiencyItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitProficiencies as Draft<{
						[key: string]: SrdProficiencyItem[];
					}>
				)[index] = [];
			}
			(
				state.selectedTraitProficiencies as Draft<{
					[key: string]: SrdProficiencyItem[];
				}>
			)[index] = (
				state.selectedTraitProficiencies as Draft<{
					[key: string]: SrdProficiencyItem[];
				}>
			)[index].filter(({ index }) => index !== proficiency);
		},
		addTraitLanguage: (
			state,
			action: PayloadAction<AddTraitLanguagePayload>
		) => {
			const { index, language } = action.payload;
			if (
				!(
					state.selectedTraitLanguages as Draft<{
						[key: string]: SrdItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitLanguages as Draft<{
						[key: string]: SrdItem[];
					}>
				)[index] = [];
			}

			(
				state.selectedTraitLanguages as Draft<{
					[key: string]: SrdItem[];
				}>
			)[index] = [
				...(
					state.selectedTraitLanguages as Draft<{
						[key: string]: SrdItem[];
					}>
				)[index],
				language
			];
		},
		removeTraitLanguage: (
			state,
			{
				payload: { index, language }
			}: PayloadAction<{ index: string; language: string }>
		) => {
			if (
				!(
					state.selectedTraitLanguages as Draft<{
						[key: string]: SrdItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitLanguages as Draft<{
						[key: string]: SrdItem[];
					}>
				)[index] = [];
			}

			(
				state.selectedTraitLanguages as Draft<{
					[key: string]: SrdItem[];
				}>
			)[index] = (
				state.selectedTraitLanguages as Draft<{
					[key: string]: SrdItem[];
				}>
			)[index].filter(({ index }) => index !== language);
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
		addTraitSpell: (state, action: PayloadAction<AddTraitSpellPayload>) => {
			const { index, spell } = action.payload;
			if (
				!(
					state.selectedTraitSpells as Draft<{
						[key: string]: SrdSpellItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitSpells as Draft<{
						[key: string]: SrdSpellItem[];
					}>
				)[index] = [];
			}

			(
				state.selectedTraitSpells as Draft<{
					[key: string]: SrdSpellItem[];
				}>
			)[index] = [
				...(
					state.selectedTraitSpells as Draft<{
						[key: string]: SrdSpellItem[];
					}>
				)[index],
				spell
			];
		},
		removeTraitSpell: (
			state,
			{
				payload: { index, spell }
			}: PayloadAction<{ index: string; spell: string }>
		) => {
			if (
				!(
					state.selectedTraitSpells as Draft<{
						[key: string]: SrdSpellItem[];
					}>
				)[index]
			) {
				(
					state.selectedTraitSpells as Draft<{
						[key: string]: SrdSpellItem[];
					}>
				)[index] = [];
			}

			(
				state.selectedTraitSpells as Draft<{
					[key: string]: SrdSpellItem[];
				}>
			)[index] = (
				state.selectedTraitSpells as Draft<{
					[key: string]: SrdSpellItem[];
				}>
			)[index].filter(({ index }) => index !== spell);
		}
	}
});

export const {
	selectRace,
	deselectRace,
	setRaceAbilityBonus,
	addRaceLanguage,
	removeRaceLanguage,
	addTraitProficiency,
	removeTraitProficiency,
	addTraitLanguage,
	removeTraitLanguage,
	selectDraconicAncestry,
	deselectDraconicAncestry,
	addTraitSpell,
	removeTraitSpell
} = raceInfoSlice.actions;
export default raceInfoSlice.reducer;
