import { PayloadAction, createSlice } from '@reduxjs/toolkit';


export const initialState = '';

const nameSlice = createSlice({
	name: 'name',
	initialState,
	reducers: {
		setName: (state, { payload }: PayloadAction<string>) => payload
	}
});

export const { setName } = nameSlice.actions;

export default nameSlice.reducer;
