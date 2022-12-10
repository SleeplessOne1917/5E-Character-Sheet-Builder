import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppReducers } from '../../types/redux';

import { SrdItem } from '../../types/srd';

export const initialState: SrdItem[] = [];

export const reducers: AppReducers<SrdItem[]> = {
	addLanguage: (state, action: PayloadAction<SrdItem>) => [
		...state,
		action.payload
	],
	removeLanguage: (state, action: PayloadAction<string>) =>
		state.filter(language => language.index !== action.payload)
};

const languagesSlice = createSlice({
	name: 'languages',
	initialState,
	reducers
});

export const { addLanguage, removeLanguage } = languagesSlice.actions;
export default languagesSlice.reducer;
