import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Item } from '../../types/db/item';
import Size from '../../types/size';

type TraitState = {
	id?: string;
	name?: string;
	proficiencies?: Item[];
	proficiencyOptions?: {
		choose?: number;
		options: Item[];
	};
	hpBonusPerLevel?: number;
	spellOptions?: {
		choose?: number;
		options: Item[];
	};
};

type TraitWithSubtraitState = TraitState & {
	subtraitOptions?: {
		choose?: number;
		options: TraitState[];
	};
};

export type EditingRaceState = {
	name: string;
	abilityBonuses: { bonus?: number; abilityScore?: Item }[];
	abilityBonusOptions?: {
		bonus?: number;
		numberOfAbilityScores?: number;
	};
	languages: Item[];
	numLanguageOptions?: number;
	size?: Size;
	speed?: number;
	traits: TraitWithSubtraitState[];
};

export const initialState: EditingRaceState = {
	name: '',
	abilityBonuses: [],
	languages: [],
	traits: []
};

const editingRaceSlice = createSlice({
	name: 'editingRace',
	initialState,
	reducers: {
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		},
		setSize: (state, { payload }: PayloadAction<Size | undefined>) => {
			state.size = payload;
		},
		setSpeed: (state, { payload }: PayloadAction<number | undefined>) => {
			state.speed = payload;
		},
		addLanguage: (state, { payload }: PayloadAction<Item>) => {
			state.languages = [...state.languages, payload];
		},
		removeLanguage: (state, { payload }: PayloadAction<string>) => {
			state.languages = state.languages.filter(({ id }) => id !== payload);
		},
		setNumLanguageOptions: (state, { payload }: PayloadAction<number>) => {
			if (payload === 0) {
				delete state.numLanguageOptions;
			} else {
				state.numLanguageOptions = payload;
			}
		},
		addAbilityBonus: state => {
			state.abilityBonuses = [...state.abilityBonuses, {}];
		},
		removeAbilityBonus: (state, { payload }: PayloadAction<number>) => {
			state.abilityBonuses = state.abilityBonuses.filter(
				(val, index) => index !== payload
			);
		},
		setAbilityBonusBonus: (
			state,
			{
				payload: { index, bonus }
			}: PayloadAction<{ index: number; bonus?: number }>
		) => {
			while (index > state.abilityBonuses.length - 1) {
				state.abilityBonuses = [...state.abilityBonuses, {}];
			}

			state.abilityBonuses[index].bonus = bonus;
		},
		setAbilityBonusAbilityScore: (
			state,
			{
				payload: { index, abilityScore }
			}: PayloadAction<{ index: number; abilityScore?: Item }>
		) => {
			while (index > state.abilityBonuses.length - 1) {
				state.abilityBonuses = [...state.abilityBonuses, {}];
			}

			state.abilityBonuses[index].abilityScore = abilityScore;
		},
		addAbilityBonusOptions: state => {
			state.abilityBonusOptions = {};
		},
		setAbilityBonusOptionsBonus: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!state.abilityBonusOptions) {
				state.abilityBonusOptions = {};
			}

			state.abilityBonusOptions.bonus = payload;
		},
		setAbilityBonusOptionsNumberOfAbilityScores: (
			state,
			{ payload }: PayloadAction<number | undefined>
		) => {
			if (!state.abilityBonusOptions) {
				state.abilityBonusOptions = {};
			}

			state.abilityBonusOptions.numberOfAbilityScores = payload;
		},
		removeAbilityBonusOptions: state => {
			delete state.abilityBonusOptions;
		}
	}
});

export const {
	setName,
	setSize,
	setSpeed,
	addLanguage,
	removeLanguage,
	setNumLanguageOptions,
	addAbilityBonus,
	removeAbilityBonus,
	setAbilityBonusBonus,
	setAbilityBonusAbilityScore,
	addAbilityBonusOptions,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores,
	removeAbilityBonusOptions
} = editingRaceSlice.actions;

export default editingRaceSlice.reducer;
