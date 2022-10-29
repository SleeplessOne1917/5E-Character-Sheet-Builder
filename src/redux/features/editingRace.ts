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
		}
	}
});

export const { setName, setSize, setSpeed, addLanguage, removeLanguage } =
	editingRaceSlice.actions;

export default editingRaceSlice.reducer;
