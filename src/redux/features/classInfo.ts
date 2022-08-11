import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdFullClassItem } from '../../types/srd';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
};

export const initialState: ClassInfoState = { level: 0 };

const classInfoSlice = createSlice({
	name: 'classInfo',
	initialState,
	reducers: {
		selectClass: (state, action: PayloadAction<SrdFullClassItem>) => {
			state.class = action.payload;
		},
		deselectClass: () => initialState,
		setLevel: (state, { payload }: PayloadAction<number>) => {
			state.level = payload;
		}
	}
});

export const { selectClass, deselectClass, setLevel } = classInfoSlice.actions;

export default classInfoSlice.reducer;
