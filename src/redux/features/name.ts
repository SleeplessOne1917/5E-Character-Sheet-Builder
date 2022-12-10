import { AppReducers } from './../../types/redux';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState = '';

export const reducers: AppReducers<string> = {
	setName: (state, { payload }: PayloadAction<string>) => payload
};

const nameSlice = createSlice({
	name: 'name',
	initialState,
	reducers
});

export const { setName } = nameSlice.actions;

export default nameSlice.reducer;
