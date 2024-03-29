import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppReducers } from './../../types/redux';
import { SpellItem } from '../../types/characterSheetBuilderAPI';

export type SpellcastingState = {
	spells: SpellItem[];
	spellsKnown: number;
	cantripsKnown: number;
	highestSlotLevel: number;
};

export const initialState: SpellcastingState = {
	spells: [],
	spellsKnown: 0,
	cantripsKnown: 0,
	highestSlotLevel: 0
};

export const reducers: AppReducers<SpellcastingState> = {
	addSpell: (state, action: PayloadAction<SpellItem>) => {
		state.spells = [...state.spells, action.payload];
	},
	removeSpell: (state, action: PayloadAction<string>) => {
		state.spells = state.spells.filter(spell => spell.id !== action.payload);
	},
	setSpellsKnown: (state, { payload }: PayloadAction<number>) => {
		state.spellsKnown = payload;
	},
	setCantripsKnown: (state, { payload }: PayloadAction<number>) => {
		state.cantripsKnown = payload;
	},
	setHighestSlotLevel: (state, { payload }: PayloadAction<number>) => {
		state.highestSlotLevel = payload;
	}
};

const spellcastingSlice = createSlice({
	name: 'spells',
	initialState,
	reducers
});

export const {
	addSpell,
	removeSpell,
	setSpellsKnown,
	setHighestSlotLevel,
	setCantripsKnown
} = spellcastingSlice.actions;
export default spellcastingSlice.reducer;
