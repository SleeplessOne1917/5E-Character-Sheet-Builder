import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';

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

export type CountedItem = {
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

export type SpellSlotsAndCantrips = {
	spellsKnown: number | null;
	cantrips: number | null;
	level1: number | null;
	level2: number | null;
	level3: number | null;
	level4: number | null;
	level5: number | null;
	level6: number | null;
	level7: number | null;
	level8: number | null;
	level9: number | null;
};

export type HandleSpellsType = 'prepare' | 'spells-known';

export type EditingClassState = {
	name: string;
	hitDie?: number;
	proficiencies: Item[];
	proficiencyChoices?: ProficiencyChoice[];
	proficiencyBonuses: (number | null)[];
	abilityScoreBonusLevels: number[];
	savingThrows: (Item | null)[];
	spellcasting?: {
		level: number;
		ability?: Item;
		spells: Item[];
		isHalfCaster: boolean;
		handleSpells?: HandleSpellsType;
		knowsCantrips: boolean;
		spellSlotsAndCantripsPerLevel: SpellSlotsAndCantrips[];
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
	proficiencyBonuses: [...Array(20).keys()].map(() => null),
	abilityScoreBonusLevels: [],
	savingThrows: [null, null],
	startingEquipment: [],
	subclassFlavor: '',
	multiclassing: {
		prerequisiteOptions: [],
		proficiencies: []
	}
};

const prepSpellcasting = (state: Draft<EditingClassState>) => {
	if (!state.spellcasting) {
		state.spellcasting = {
			level: 1,
			spells: [],
			knowsCantrips: true,
			isHalfCaster: false,
			spellSlotsAndCantripsPerLevel: [
				...Array(20).keys()
			].map<SpellSlotsAndCantrips>(() => ({
				spellsKnown: null,
				cantrips: null,
				level1: null,
				level2: null,
				level3: null,
				level4: null,
				level5: null,
				level6: null,
				level7: null,
				level8: null,
				level9: null
			}))
		};
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
		},
		setSavingThrow: (
			state,
			{
				payload: { index, savingThrow }
			}: PayloadAction<{ index: number; savingThrow: Item | null }>
		) => {
			state.savingThrows[index] = savingThrow;
		},
		addSpellcasting: state => {
			state.spellcasting = {
				level: 1,
				spells: [],
				knowsCantrips: true,
				isHalfCaster: false,
				spellSlotsAndCantripsPerLevel: [
					...Array(20).keys()
				].map<SpellSlotsAndCantrips>(() => ({
					spellsKnown: null,
					cantrips: null,
					level1: null,
					level2: null,
					level3: null,
					level4: null,
					level5: null,
					level6: null,
					level7: null,
					level8: null,
					level9: null
				}))
			};
		},
		removeSpellcasting: state => {
			delete state.spellcasting;
		},
		setSpellcastingAbility: (
			state,
			{ payload }: PayloadAction<Item | undefined>
		) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.ability = payload;
		},
		setSpellcastingLevel: (state, { payload }: PayloadAction<number>) => {
			if (!state.spellcasting) {
				state.spellcasting = {
					spells: [],
					spellSlotsAndCantripsPerLevel: [
						...Array(20).keys()
					].map<SpellSlotsAndCantrips>(() => ({
						cantrips: 1,
						level1: null,
						level2: null,
						level3: null,
						level4: null,
						level5: null,
						level6: null,
						level7: null,
						level8: null,
						level9: null
					}))
				};
			}

			state.spellcasting.level = payload;
		},
		addSpellcastingSpell: (state, { payload }: PayloadAction<Item>) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.spells.push(payload);
		},
		removeSpellcastingSpell: (state, { payload }: PayloadAction<string>) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.spells = state.spellcasting?.spells.filter(
				({ id }) => id !== payload
			);
		},
		setSpellcastingSpellsKnown: (
			state,
			{
				payload: { classLevel, spellsKnown }
			}: PayloadAction<{ classLevel: number; spellsKnown: number | null }>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					!state.spellcasting?.spellSlotsAndCantripsPerLevel[i].spellsKnown ||
					(state.spellcasting.spellSlotsAndCantripsPerLevel[i].spellsKnown ??
						0) < (spellsKnown ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i].spellsKnown =
						spellsKnown;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if (
					(state.spellcasting?.spellSlotsAndCantripsPerLevel[i].spellsKnown ??
						0) > (spellsKnown ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i].spellsKnown =
						spellsKnown;
				}
			}
		},
		setSpellcastingCantripsKnown: (
			state,
			{
				payload: { classLevel, cantrips }
			}: PayloadAction<{ classLevel: number; cantrips: number | null }>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					!state.spellcasting?.spellSlotsAndCantripsPerLevel[i].cantrips ||
					(state.spellcasting.spellSlotsAndCantripsPerLevel[i].cantrips ?? 0) <
						(cantrips ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i].cantrips =
						cantrips;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if (
					(state.spellcasting?.spellSlotsAndCantripsPerLevel[i].cantrips ?? 0) >
					(cantrips ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i].cantrips =
						cantrips;
				}
			}
		},
		setSpellcastingSpellSlots: (
			state,
			{
				payload: { classLevel, spellLevel, slots }
			}: PayloadAction<{
				classLevel: number;
				spellLevel: number;
				slots: number | null;
			}>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					//@ts-ignore
					!state.spellcasting?.spellSlotsAndCantripsPerLevel[i][
						`level${spellLevel}`
					] ||
					//@ts-ignore
					(state.spellcasting.spellSlotsAndCantripsPerLevel[i][
						`level${spellLevel}`
					] ?? 0) < (slots ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i][
						`level${spellLevel}`
					] = slots;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if (
					//@ts-ignore
					(state.spellcasting.spellSlotsAndCantripsPerLevel[i][
						`level${spellLevel}`
					] ?? 0) > (slots ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.spellSlotsAndCantripsPerLevel[i][
						`level${spellLevel}`
					] = slots;
				}
			}
		},
		setIsHalfCaster: (state, { payload }: PayloadAction<boolean>) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.isHalfCaster = payload;
		},
		setKnowsCantrips: (state, { payload }: PayloadAction<boolean>) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.knowsCantrips = payload;
		},
		setHandleSpells: (
			state,
			{ payload }: PayloadAction<HandleSpellsType | undefined>
		) => {
			prepSpellcasting(state);

			//@ts-ignore
			state.spellcasting.handleSpells = payload;
		},
		setProficiencyBonus: (
			state,
			{
				payload: { classLevel, proficiencyBonus }
			}: PayloadAction<{ classLevel: number; proficiencyBonus: number | null }>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					!state.proficiencyBonuses[i] ||
					(state.proficiencyBonuses[i] ?? 0) < (proficiencyBonus ?? 0)
				) {
					state.proficiencyBonuses[i] = proficiencyBonus;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if ((state.proficiencyBonuses[i] ?? 0) > (proficiencyBonus ?? 0)) {
					state.proficiencyBonuses[i] = proficiencyBonus;
				}
			}
		},
		addAbilityScoreBonusLevel: (state, { payload }: PayloadAction<number>) => {
			state.abilityScoreBonusLevels.push(payload);
		},
		removeAbilityScoreBonusLevel: (
			state,
			{ payload }: PayloadAction<number>
		) => {
			state.abilityScoreBonusLevels = state.abilityScoreBonusLevels.filter(
				level => level !== payload
			);
		},
		addStartingEquipment: state => {
			state.startingEquipment.push({});
		},
		removeStartingEquipment: (state, { payload }: PayloadAction<number>) => {
			state.startingEquipment = state.startingEquipment.filter(
				(_, i) => i !== payload
			);
		},
		setStartingEquipmentItem: (
			state,
			{
				payload: { index, item }
			}: PayloadAction<{ index: number; item?: Item }>
		) => {
			while (state.startingEquipment.length <= index) {
				state.startingEquipment.push({});
			}

			state.startingEquipment[index].item = item;
		},
		setStartingEquipmentCount: (
			state,
			{
				payload: { index, count }
			}: PayloadAction<{ index: number; count?: number }>
		) => {
			while (state.startingEquipment.length <= index) {
				state.startingEquipment.push({});
			}

			state.startingEquipment[index].count = count;
		}
	}
});

export const {
	setName,
	setHitDie,
	setProficiencies,
	addProficiencyChoice,
	removeProficiencyChoice,
	setProficiencyChoice,
	setSavingThrow,
	addSpellcasting,
	removeSpellcasting,
	setSpellcastingAbility,
	setSpellcastingLevel,
	addSpellcastingSpell,
	removeSpellcastingSpell,
	setSpellcastingSpellsKnown,
	setSpellcastingCantripsKnown,
	setSpellcastingSpellSlots,
	setIsHalfCaster,
	setKnowsCantrips,
	setHandleSpells,
	setProficiencyBonus,
	addAbilityScoreBonusLevel,
	removeAbilityScoreBonusLevel,
	addStartingEquipment,
	removeStartingEquipment,
	setStartingEquipmentCount,
	setStartingEquipmentItem
} = editingClassSlice.actions;

export default editingClassSlice.reducer;
