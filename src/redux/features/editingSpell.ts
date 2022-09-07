import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpellComponent } from '../../types/srd';
import { Item } from '../../types/db/item';

export type EditingSpellState = {
	name: string;
	level: number | null;
	castingTime: string;
	duration: string;
	range: string;
	school: Item | null;
	components: SpellComponent[] | null;
	material?: string;
	concentration: boolean;
	ritual: boolean;
	description: string;
	atHigherLevels?: string;
	damageType?: Item;
	classes: Item[];
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
	components: null,
	classes: []
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
		setSchool: (state, { payload }: PayloadAction<Item | null>) => {
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
		setDamageType: (state, { payload }: PayloadAction<Item | undefined>) => {
			state.damageType = payload;
		},
		setClasses: (state, { payload }: PayloadAction<Item[]>) => {
			state.classes = payload;
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
	setAtHigherLevels,
	setDamageType,
	setClasses
} = editingSpellSlice.actions;

export default editingSpellSlice.reducer;
