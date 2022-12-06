import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdItem } from '../../types/srd';

export const initialState: SrdItem[] = [];

const languagesSlice = createSlice({
	name: 'languages',
	initialState,
	reducers: {
		addLanguage: (state, action: PayloadAction<SrdItem>) => [
			...state,
			action.payload
		],
		removeLanguage: (state, action: PayloadAction<string>) =>
			state.filter(language => language.index !== action.payload)
	}
});

export const { addLanguage, removeLanguage } = languagesSlice.actions;
export default languagesSlice.reducer;
