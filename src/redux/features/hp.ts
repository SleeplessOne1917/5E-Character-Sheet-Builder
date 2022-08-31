import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type AutoLevelType = 'off' | 'roll' | 'average';

export type HPState = {
	autoLevel: AutoLevelType;
};

export const initialState: HPState = {
	autoLevel: 'off'
};

const hpSlice = createSlice({
	name: 'hp',
	initialState,
	reducers: {
		setAutoLevel: (state, { payload }: PayloadAction<AutoLevelType>) => {
			state.autoLevel = payload;
		}
	}
});

export const { setAutoLevel } = hpSlice.actions;

export default hpSlice.reducer;
