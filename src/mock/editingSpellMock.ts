import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep, merge } from 'lodash';
import {
	reducers,
	initialState,
	EditingSpellState
} from '../redux/features/editingSpell';
import { DeepPartial } from '../types/helpers';

const getEditingSpellMock = (overrides: DeepPartial<EditingSpellState>) => {
	const mockEditingSpellSlice = createSlice({
		name: 'editingSpell',
		reducers,
		initialState: merge(cloneDeep(initialState), overrides)
	});

	return mockEditingSpellSlice.reducer;
};

export default getEditingSpellMock;
