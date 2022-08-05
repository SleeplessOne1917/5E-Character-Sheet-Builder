import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdProficiencyItem } from '../../types/srd';

export const initialState: SrdProficiencyItem[] = [];

const proficienciesSlice = createSlice({
	name: 'proficiencies',
	initialState,
	reducers: {
		addProficiency: (state, action: PayloadAction<SrdProficiencyItem>) => [
			...state,
			action.payload
		],
		removeProficiency: (state, action: PayloadAction<string>) =>
			state.filter(proficiency => proficiency.index !== action.payload)
	}
});

export const { addProficiency, removeProficiency } = proficienciesSlice.actions;
export default proficienciesSlice.reducer;
