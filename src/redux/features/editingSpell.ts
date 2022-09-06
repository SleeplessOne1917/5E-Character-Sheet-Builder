import { SrdItem } from './../../types/srd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpellComponent } from '../../types/srd';

export type EditingSpellState = {
	name: string;
	level: number | null;
	castingTime: string;
	duration: string;
	range: string;
	school: SrdItem | null;
	components: SpellComponent[] | null;
	material?: string;
	concentration: boolean;
	ritual: boolean;
	description: string;
	atHigherLevels?: string;
};

export const initialState: EditingSpellState = {
	name: '',
	castingTime: '',
	duration: '',
	range: '',
	concentration: false,
	ritual: false,
	description: '',
	level: null,
	school: null,
	components: null
};

const editingSpellSlice = createSlice({
	name: 'editingSpell',
	initialState,
	reducers: {
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		},
		setLevel: (state, { payload }: PayloadAction<number | null>) => {
			state.level = payload;
		},
		setCastingTime: (state, { payload }: PayloadAction<string>) => {
			state.castingTime = payload;
		},
		setDuration: (state, { payload }: PayloadAction<string>) => {
			state.duration = payload;
		},
		setRange: (state, { payload }: PayloadAction<string>) => {
			state.range = payload;
		},
		setSchool: (state, { payload }: PayloadAction<SrdItem | null>) => {
			state.school = payload;
		},
		addComponent: (state, { payload }: PayloadAction<SpellComponent>) => {
			state.components = [...(state.components ?? []), payload];
		},
		removeComponent: (state, { payload }: PayloadAction<SpellComponent>) => {
			state.components = (state.components ?? []).filter(
				component => component !== payload
			);
		},
		setMaterial: (state, { payload }: PayloadAction<string | undefined>) => {
			state.material = payload;
		},
		setConcentration: (state, { payload }: PayloadAction<boolean>) => {
			state.concentration = payload;
		},
		setRitual: (state, { payload }: PayloadAction<boolean>) => {
			state.ritual = payload;
		},
		setDescription: (state, { payload }: PayloadAction<string>) => {
			state.description = payload;
		},
		setAtHigherLevels: (
			state,
			{ payload }: PayloadAction<string | undefined>
		) => {
			state.atHigherLevels = payload;
		},
		resetSpell: () => initialState
	}
});

export const {
	setName,
	resetSpell,
	setLevel,
	setCastingTime,
	setDuration,
	setRange,
	setSchool,
	addComponent,
	removeComponent,
	setMaterial,
	setConcentration,
	setRitual,
	setDescription,
	setAtHigherLevels
} = editingSpellSlice.actions;

export default editingSpellSlice.reducer;
