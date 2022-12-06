import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SrdProficiencyItem } from '../../types/srd';

export const initialState: SrdProficiencyItem[] = [];

const proficienciesSlice = createSlice({
	name: 'proficiencies',
	initialState,
	reducers: {
		addProficiency: (state, { payload }: PayloadAction<SrdProficiencyItem>) => [
			...state,
			payload
		],
		removeProficiency: (state, action: PayloadAction<string>) =>
			state.reduce<{ replaced: boolean; list: SrdProficiencyItem[] }>(
				(acc, cur) => {
					if (cur.index === action.payload && !acc.replaced) {
						return {
							...acc,
							replaced: true
						};
					} else {
						return {
							...acc,
							list: [...acc.list, cur]
						};
					}
				},
				{ replaced: false, list: [] }
			).list
	}
});

export const { addProficiency, removeProficiency } = proficienciesSlice.actions;

export default proficienciesSlice.reducer;
