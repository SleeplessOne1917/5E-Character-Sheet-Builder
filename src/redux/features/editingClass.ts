import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import { XOR } from '../../types/helpers';

export type Choose = {
	choose?: number;
	options?: Partial<Item>[];
};

export type ProficiencyChoice = {
	choose?: number;
	options?: Partial<XOR<Item, Choose>>[];
};

type CountedItem = {
	count?: number;
	item?: Item;
};

type ChooseEquipmentCategory = {
	choose?: number;
	equipmentCategory?: Item;
};

type Multiple = {
	items: XOR<CountedItem, ChooseEquipmentCategory>[];
};

export type EditingClassState = {
	name: string;
	hitDie?: number;
	proficiencies: Item[];
	proficiencyChoices?: ProficiencyChoice[];
	savingThrows: Item[];
	spellcasting?: {
		level?: number;
		ability?: Item;
	};
	startingEquipment: CountedItem[];
	startingEquipmentOptions?: {
		choose?: number;
		options?: XOR<CountedItem, XOR<ChooseEquipmentCategory, Multiple>>;
	}[];
	subclassFlavor: string;
	multiclassing: {
		prerequisiteOptions: {
			ability?: Item;
			minimumScore?: number;
		}[];
		proficiencies: Item[];
		proficiencyChoices?: ProficiencyChoice[];
	};
};

export const initialState: EditingClassState = {
	name: '',
	proficiencies: [],
	savingThrows: [],
	startingEquipment: [],
	subclassFlavor: '',
	multiclassing: {
		prerequisiteOptions: [],
		proficiencies: []
	}
};

const editingClassSlice = createSlice({
	name: 'editingClass',
	initialState,
	reducers: {
		setName: (state, { payload }: PayloadAction<string>) => {
			state.name = payload;
		},
		setHitDie: (state, { payload }: PayloadAction<number | undefined>) => {
			state.hitDie = payload;
		},
		setProficiencies: (state, { payload }: PayloadAction<Item[]>) => {
			state.proficiencies = payload;
		},
		addProficiencyChoice: state => {
			if (!state.proficiencyChoices) {
				state.proficiencyChoices = [];
			}

			state.proficiencyChoices.push({});
		},
		removeProficiencyChoice: (state, { payload }: PayloadAction<number>) => {
			state.proficiencyChoices = state.proficiencyChoices?.filter(
				(val, i) => i !== payload
			);

			if (
				state.proficiencyChoices?.length &&
				state.proficiencyChoices.length === 0
			) {
				delete state.proficiencyChoices;
			}
		},
		setProficiencyChoice: (
			state,
			{
				payload: { index, proficiencyChoice }
			}: PayloadAction<{
				index: number;
				proficiencyChoice: ProficiencyChoice;
			}>
		) => {
			if (!state.proficiencyChoices) {
				state.proficiencyChoices = [];
			}

			while (state.proficiencyChoices.length < index + 1) {
				state.proficiencyChoices.push({});
			}

			state.proficiencyChoices[index] = proficiencyChoice;
		}
	}
});

export const {
	setName,
	setHitDie,
	setProficiencies,
	addProficiencyChoice,
	removeProficiencyChoice,
	setProficiencyChoice
} = editingClassSlice.actions;

export default editingClassSlice.reducer;
