import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SrdFullClassItem, SrdSubclassItem } from '../../types/srd';

export type ClassInfoState = {
	class?: SrdFullClassItem;
	level: number;
	subclass?: SrdSubclassItem;
};

export const initialState: ClassInfoState = { level: 1 };

const classInfoSlice = createSlice({
	name: 'classInfo',
	initialState,
	reducers: {
		selectClass: (state, { payload }: PayloadAction<SrdFullClassItem>) => {
			state.class = payload;
		},
		deselectClass: () => initialState,
		setLevel: (state, { payload }: PayloadAction<number>) => {
			state.level = payload;
		},
		selectSubclass: (state, { payload }: PayloadAction<SrdSubclassItem>) => {
			state.subclass = payload;
		},
		deselectSubclass: state => {
			delete state.subclass;
		}
	}
});

export const {
	selectClass,
	deselectClass,
	setLevel,
	selectSubclass,
	deselectSubclass
} = classInfoSlice.actions;

export default classInfoSlice.reducer;
