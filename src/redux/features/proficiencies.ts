import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdProficiencyItem } from '../../types/srd';

export const initialState: SrdProficiencyItem[] = [];

const proficienciesSlice = createSlice({
	name: 'proficiencies',
	initialState,
	reducers: {
		addProficiency: (state, { payload }: PayloadAction<SrdProficiencyItem>) => {
			if (!state.some(proficiency => proficiency.index === payload.index)) {
				return [...state, payload];
			} else {
				return state;
			}
		},
		removeProficiency: (state, action: PayloadAction<string>) =>
			state.filter(proficiency => proficiency.index !== action.payload)
	}
});

export const { addProficiency, removeProficiency } = proficienciesSlice.actions;
export default proficienciesSlice.reducer;
