import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdFullClassItem } from '../../types/srd';

export type ClassInfoState = {
	class?: SrdFullClassItem;
};

export const initialState: ClassInfoState = {};

const classInfoSlice = createSlice({
	name: 'classInfo',
	initialState,
	reducers: {
		selectClass: (state, action: PayloadAction<SrdFullClassItem>) => {
			state.class = action.payload;
		},
		deselectClass: () => initialState
	}
});

export const { selectClass, deselectClass } = classInfoSlice.actions;

export default classInfoSlice.reducer;
