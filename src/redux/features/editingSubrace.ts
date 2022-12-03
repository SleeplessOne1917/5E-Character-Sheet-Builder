import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import Size from '../../types/size';
import { TraitWithSubtraitsState } from './editingRace';

type EditingSubraceStateOverrides = {
	abilityBonuses?: boolean;
	abilityBonusOptions?: boolean;
	languages?: boolean;
	numberOfLanguageOptions?: boolean;
	size?: boolean;
	speed?: boolean;
};

export type EditingSubraceState = {
	name: string;
	abilityBonuses?: { bonus?: number; abilityScore?: Item }[];
	abilityBonusOptions?: {
		bonus?: number;
		numberOfAbilityScores?: number;
	};
	languages?: Item[];
	numberOfLanguageOptions?: number;
	size?: Size;
	speed?: number;
	traits: TraitWithSubtraitsState[];
	overrides?: EditingSubraceStateOverrides;
	omittedRaceTraits?: string[];
	race?: Item;
};

const initialState: EditingSubraceState = {
	name: '',
	traits: []
};

const editingSubraceSlice = createSlice({
	name: 'editingSubrace',
	initialState,
	reducers: {
		resetSubrace: () => initialState,
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		}
	}
});

export const { resetSubrace, setName } = editingSubraceSlice.actions;

export default editingSubraceSlice.reducer;
