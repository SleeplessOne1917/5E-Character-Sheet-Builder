import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdSpellItem } from '../../types/srd';

export const initialState: SrdSpellItem[] = [];

const spellsSlice = createSlice({
	name: 'spells',
	initialState,
	reducers: {
		addSpell: (state, action: PayloadAction<SrdSpellItem>) => [
			...state,
			action.payload
		],
		removeSpell: (state, action: PayloadAction<string>) =>
			state.filter(spell => spell.index !== action.payload)
	}
});

export const { addSpell, removeSpell } = spellsSlice.actions;
export default spellsSlice.reducer;
