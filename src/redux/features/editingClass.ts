import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import { XOR } from '../../types/helpers';
import proficiencies from './proficiencies';

type Choose = {
	choose?: number;
	options: Item[];
};

type ProficiciencyChoice = {
	choose?: number;
	options?: XOR<Item, Choose>[];
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
	proficiencyChoices?: ProficiciencyChoice[];
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
		proficiencyChoices?: ProficiciencyChoice[];
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
		}
	}
});

export const { setName, setHitDie } = editingClassSlice.actions;

export default editingClassSlice.reducer;
