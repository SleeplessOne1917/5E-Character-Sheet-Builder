import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Item } from '../../types/db/item';
import { XOR } from '../../types/helpers';

export type ItemType = 'item' | 'category';
export type StartingEquipmentOptionType = ItemType | 'multiple';
export type ProficiencySuboptionType = 'proficiency' | 'type';
export type ProficiencyOptionType = ProficiencySuboptionType | 'choice';

export type Choose = {
	choose?: number;
	options?: (Partial<
		XOR<{ proficiency: Item }, { proficiencyType: string; choose: number }>
	> & {
		optionType: ProficiencySuboptionType;
	})[];
};

export type ProficiencyChoice = {
	choose?: number;
	options: (Partial<
		XOR<
			XOR<{ proficiency: Item }, Choose>,
			{ proficiencyType: string; choose: number }
		>
	> & {
		optionType: ProficiencyOptionType;
	})[];
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
	items: (XOR<CountedItem, ChooseEquipmentCategory> & { itemType: ItemType })[];
};

export type SpellcastingLevel = {
	spellsKnown: number | null;
	cantrips: number | null;
	slotLevel: number | null;
	slots: number | null;
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

export type StartingEquipmentChoiceType = {
	choose?: number;
	options: (XOR<CountedItem, XOR<ChooseEquipmentCategory, Multiple>> & {
		optionType: StartingEquipmentOptionType;
	})[];
};

export type SpellSlotStyle = 'half' | 'full' | 'warlock';

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
		spellSlotStyle: SpellSlotStyle;
		handleSpells?: HandleSpellsType;
		knowsCantrips: boolean;
		levels: SpellcastingLevel[];
	};
	startingEquipment: CountedItem[];
	startingEquipmentChoices?: StartingEquipmentChoiceType[];
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

type WithIndex = { index: number };

type WithOptionIndex = { choiceIndex: number; optionIndex: number };

type WithItemIndex = { itemIndex: number } & WithOptionIndex;

type WithSubOptionIndex = { suboptionIndex: number } & WithOptionIndex;

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
			spellSlotStyle: 'full',
			levels: [...Array(20).keys()].map<SpellcastingLevel>(() => ({
				spellsKnown: null,
				cantrips: null,
				slotLevel: null,
				slots: null,
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

const prepProficiencyChoice = (
	state: Draft<EditingClassState>,
	index: number
) => {
	if (!state.proficiencyChoices) {
		state.proficiencyChoices = [];
	}

	while (state.proficiencyChoices.length < index + 1) {
		state.proficiencyChoices.push({ options: [] });
	}
};

const prepProficiencyChoiceOption = (
	state: Draft<EditingClassState>,
	choiceIndex: number,
	optionIndex: number
) => {
	prepProficiencyChoice(state, choiceIndex);

	while (state.proficiencyChoices![choiceIndex].options.length <= optionIndex) {
		state.proficiencyChoices![choiceIndex].options.push({
			optionType: 'proficiency'
		});
	}
};

const prepProficiencyChoiceOptionSuboption = (
	state: Draft<EditingClassState>,
	choiceIndex: number,
	optionIndex: number,
	suboptionIndex: number
) => {
	prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

	if (!state.proficiencyChoices![choiceIndex].options[optionIndex].options) {
		state.proficiencyChoices![choiceIndex].options[optionIndex].options = [];
	}

	while (
		state.proficiencyChoices![choiceIndex].options[optionIndex].options!
			.length <= suboptionIndex
	) {
		state.proficiencyChoices![choiceIndex].options[optionIndex].options!.push({
			optionType: 'proficiency'
		});
	}
};

const prepStartingEquipmentChoice = (
	state: Draft<EditingClassState>,
	index: number
) => {
	if (!state.startingEquipmentChoices) {
		state.startingEquipmentChoices = [];
	}
	while (state.startingEquipmentChoices!.length <= index) {
		state.startingEquipmentChoices.push({ options: [] });
	}
};

const prepStartingEquipmentChoiceOption = (
	state: Draft<EditingClassState>,
	choiceIndex: number,
	optionIndex: number
) => {
	prepStartingEquipmentChoice(state, choiceIndex);

	while (
		state.startingEquipmentChoices![choiceIndex].options.length <= optionIndex
	) {
		state.startingEquipmentChoices![choiceIndex].options.push({
			optionType: 'item'
		});
	}
};

const prepStartingEquipmentChoiceOptionItem = (
	state: Draft<EditingClassState>,
	choiceIndex: number,
	optionIndex: number,
	itemIndex: number
) => {
	prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

	if (
		!state.startingEquipmentChoices![choiceIndex].options[optionIndex].items
	) {
		state.startingEquipmentChoices![choiceIndex].options[optionIndex].items =
			[];
	}

	while (
		state.startingEquipmentChoices![choiceIndex].options[optionIndex].items!
			.length <= itemIndex
	) {
		state.startingEquipmentChoices![choiceIndex].options[
			optionIndex
		].items!.push({ itemType: 'item' });
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

			state.proficiencyChoices.push({ options: [] });
		},
		removeProficiencyChoice: (state, { payload }: PayloadAction<number>) => {
			state.proficiencyChoices = state.proficiencyChoices?.filter(
				(val, i) => i !== payload
			);

			if ((state.proficiencyChoices?.length ?? 0) === 0) {
				delete state.proficiencyChoices;
			}
		},
		setProficiencyChoiceChoose: (
			state,
			{
				payload: { index, choose }
			}: PayloadAction<{ choose?: number } & WithIndex>
		) => {
			prepProficiencyChoice(state, index);

			state.proficiencyChoices![index].choose = choose;
		},
		addProficiencyChoiceOption: (state, { payload }: PayloadAction<number>) => {
			prepProficiencyChoice(state, payload);

			state.proficiencyChoices![payload].options.push({
				optionType: 'proficiency'
			});
		},
		setProficiencyChoiceOptionType: (
			state,
			{
				payload: { choiceIndex, optionIndex, optionType }
			}: PayloadAction<
				{
					optionType: ProficiencyOptionType;
				} & WithOptionIndex
			>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			state.proficiencyChoices![choiceIndex].options[optionIndex].optionType =
				optionType;
		},
		removeProficiencyChoiceOption: (
			state,
			{ payload: { choiceIndex, optionIndex } }: PayloadAction<WithOptionIndex>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			state.proficiencyChoices![choiceIndex].options =
				state.proficiencyChoices![choiceIndex].options.filter(
					(_, i) => i !== optionIndex
				);
		},
		setProficiencyChoiceOptionProficiency: (
			state,
			{
				payload: { choiceIndex, optionIndex, proficiency }
			}: PayloadAction<
				{
					proficiency?: Item;
				} & WithOptionIndex
			>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			state.proficiencyChoices![choiceIndex].options[optionIndex].proficiency =
				proficiency;
		},
		setProficiencyChoiceOptionChoose: (
			state,
			{
				payload: { choiceIndex, optionIndex, choose }
			}: PayloadAction<{ choose?: number } & WithOptionIndex>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			state.proficiencyChoices![choiceIndex].options[optionIndex].choose =
				choose;
		},
		setProficiencyChoiceOptionProficiencyType: (
			state,
			{
				payload: { choiceIndex, optionIndex, proficiencyType }
			}: PayloadAction<{ proficiencyType?: string } & WithOptionIndex>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			state.proficiencyChoices![choiceIndex].options[
				optionIndex
			].proficiencyType = proficiencyType;
		},
		addProficiencyChoiceOptionSuboption: (
			state,
			{ payload: { choiceIndex, optionIndex } }: PayloadAction<WithOptionIndex>
		) => {
			prepProficiencyChoiceOption(state, choiceIndex, optionIndex);

			if (
				!state.proficiencyChoices![choiceIndex].options[optionIndex].options
			) {
				state.proficiencyChoices![choiceIndex].options[optionIndex].options =
					[];
			}

			state.proficiencyChoices![choiceIndex].options[optionIndex].options?.push(
				{ optionType: 'proficiency' }
			);
		},
		removeProficiencyChoiceOptionSuboption: (
			state,
			{
				payload: { choiceIndex, optionIndex, suboptionIndex }
			}: PayloadAction<WithSubOptionIndex>
		) => {
			prepProficiencyChoiceOptionSuboption(
				state,
				choiceIndex,
				optionIndex,
				suboptionIndex
			);

			state.proficiencyChoices![choiceIndex].options[optionIndex].options =
				state.proficiencyChoices![choiceIndex].options[
					optionIndex
				].options?.filter((_, i) => i !== suboptionIndex);

			if (
				state.proficiencyChoices![choiceIndex].options[optionIndex].options
					?.length === 0
			) {
				delete state.proficiencyChoices![choiceIndex].options[optionIndex]
					.options;
			}
		},
		setProficiencyChoiceOptionSuboptionType: (
			state,
			{
				payload: { choiceIndex, optionIndex, suboptionIndex, optionType }
			}: PayloadAction<
				{ optionType: ProficiencySuboptionType } & WithSubOptionIndex
			>
		) => {
			prepProficiencyChoiceOptionSuboption(
				state,
				choiceIndex,
				optionIndex,
				suboptionIndex
			);

			state.proficiencyChoices![choiceIndex].options[optionIndex].options![
				suboptionIndex
			].optionType = optionType;
		},
		setProficiencyChoiceOptionSuboptionProficiency: (
			state,
			{
				payload: { choiceIndex, optionIndex, suboptionIndex, proficiency }
			}: PayloadAction<{ proficiency?: Item } & WithSubOptionIndex>
		) => {
			prepProficiencyChoiceOptionSuboption(
				state,
				choiceIndex,
				optionIndex,
				suboptionIndex
			);

			state.proficiencyChoices![choiceIndex].options[optionIndex].options![
				suboptionIndex
			].proficiency = proficiency;
		},
		setProficiencyChoiceOptionSuboptionChoose: (
			state,
			{
				payload: { choiceIndex, optionIndex, suboptionIndex, choose }
			}: PayloadAction<{ choose?: number } & WithSubOptionIndex>
		) => {
			prepProficiencyChoiceOptionSuboption(
				state,
				choiceIndex,
				optionIndex,
				suboptionIndex
			);

			state.proficiencyChoices![choiceIndex].options[optionIndex].options![
				suboptionIndex
			].choose = choose;
		},
		setProficiencyChoiceOptionSuboptionProficiencyType: (
			state,
			{
				payload: { choiceIndex, optionIndex, suboptionIndex, proficiencyType }
			}: PayloadAction<{ proficiencyType?: string } & WithSubOptionIndex>
		) => {
			prepProficiencyChoiceOptionSuboption(
				state,
				choiceIndex,
				optionIndex,
				suboptionIndex
			);

			state.proficiencyChoices![choiceIndex].options[optionIndex].options![
				suboptionIndex
			].proficiencyType = proficiencyType;
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
				spellSlotStyle: 'full',
				levels: [...Array(20).keys()].map<SpellcastingLevel>(() => ({
					spellsKnown: null,
					cantrips: null,
					slotLevel: null,
					slots: null,
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
			prepSpellcasting(state);

			state.spellcasting!.level = payload;
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
					!state.spellcasting?.levels[i].spellsKnown ||
					(state.spellcasting.levels[i].spellsKnown ?? 0) < (spellsKnown ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.levels[i].spellsKnown = spellsKnown;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if (
					(state.spellcasting?.levels[i].spellsKnown ?? 0) > (spellsKnown ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.levels[i].spellsKnown = spellsKnown;
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
					!state.spellcasting?.levels[i].cantrips ||
					(state.spellcasting.levels[i].cantrips ?? 0) < (cantrips ?? 0)
				) {
					state.spellcasting!.levels[i].cantrips = cantrips;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if ((state.spellcasting?.levels[i].cantrips ?? 0) > (cantrips ?? 0)) {
					state.spellcasting!.levels[i].cantrips = cantrips;
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
					!state.spellcasting?.levels[i][`level${spellLevel}`] ||
					//@ts-ignore
					(state.spellcasting.levels[i][`level${spellLevel}`] ?? 0) <
						(slots ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.levels[i][`level${spellLevel}`] = slots;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if (
					//@ts-ignore
					(state.spellcasting.levels[i][`level${spellLevel}`] ?? 0) >
					(slots ?? 0)
				) {
					//@ts-ignore
					state.spellcasting.levels[i][`level${spellLevel}`] = slots;
				}
			}
		},
		setSpellcastingSlotLevel: (
			state,
			{
				payload: { classLevel, slotLevel }
			}: PayloadAction<{ classLevel: number; slotLevel: number | null }>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					!state.spellcasting!.levels[i].slotLevel ||
					(state.spellcasting!.levels[i].slotLevel ?? 0) < (slotLevel ?? 0)
				) {
					state.spellcasting!.levels[i].slotLevel = slotLevel;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if ((state.spellcasting!.levels[i].slotLevel ?? 0) > (slotLevel ?? 0)) {
					state.spellcasting!.levels[i].slotLevel = slotLevel;
				}
			}
		},
		setSpellSlotStyle: (state, { payload }: PayloadAction<SpellSlotStyle>) => {
			prepSpellcasting(state);

			state.spellcasting!.spellSlotStyle = payload;
		},
		setSpellcastingNonLeveledSlots: (
			state,
			{
				payload: { classLevel, slots }
			}: PayloadAction<{ classLevel: number; slots: number | null }>
		) => {
			prepSpellcasting(state);

			for (let i = classLevel - 1; i < 20; ++i) {
				if (
					i === classLevel - 1 ||
					!state.spellcasting!.levels[i].slots ||
					(state.spellcasting!.levels[i].slots ?? 0) < (slots ?? 0)
				) {
					state.spellcasting!.levels[i].slots = slots;
				}
			}

			for (let i = classLevel - 2; i >= 0; --i) {
				if ((state.spellcasting!.levels[i].slots ?? 0) > (slots ?? 0)) {
					state.spellcasting!.levels[i].slots = slots;
				}
			}
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
			{ payload: { index, item } }: PayloadAction<{ item?: Item } & WithIndex>
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
			}: PayloadAction<{ count?: number } & WithIndex>
		) => {
			while (state.startingEquipment.length <= index) {
				state.startingEquipment.push({});
			}

			state.startingEquipment[index].count = count;
		},
		addStartingEquipmentChoice: state => {
			if (!state.startingEquipmentChoices) {
				state.startingEquipmentChoices = [];
			}

			state.startingEquipmentChoices.push({ options: [] });
		},
		removeStartingEquipmentChoice: (
			state,
			{ payload }: PayloadAction<number>
		) => {
			state.startingEquipmentChoices = state.startingEquipmentChoices?.filter(
				(_, i) => i !== payload
			);

			if (state.startingEquipmentChoices?.length === 0) {
				delete state.startingEquipmentChoices;
			}
		},
		setStartingEquipmentChoiceChoose: (
			state,
			{
				payload: { index, choose }
			}: PayloadAction<{ choose?: number } & WithIndex>
		) => {
			prepStartingEquipmentChoice(state, index);

			state.startingEquipmentChoices![index].choose = choose;
		},
		addStartingEquipmentChoiceOption: (
			state,
			{ payload }: PayloadAction<number>
		) => {
			prepStartingEquipmentChoice(state, payload);

			state.startingEquipmentChoices![payload].options!.push({
				optionType: 'item'
			});
		},
		removeStartingEquipmentChoiceOption: (
			state,
			{ payload: { choiceIndex, optionIndex } }: PayloadAction<WithOptionIndex>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options =
				state.startingEquipmentChoices![choiceIndex].options.filter(
					(_, i) => i !== optionIndex
				);
		},
		setStartingEquipmentChoiceOptionType: (
			state,
			{
				payload: { choiceIndex, optionIndex, optionType }
			}: PayloadAction<
				{
					optionType: StartingEquipmentOptionType;
				} & WithOptionIndex
			>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex] = {
				optionType
			};
		},
		setStartingEquipmentChoiceOptionCount: (
			state,
			{
				payload: { choiceIndex, optionIndex, count }
			}: PayloadAction<
				{
					count?: number;
				} & WithOptionIndex
			>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].count =
				count;
		},
		setStartingEquipmentChoiceOptionItem: (
			state,
			{
				payload: { choiceIndex, optionIndex, item }
			}: PayloadAction<
				{
					item?: Item;
				} & WithOptionIndex
			>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].item =
				item;
		},
		setStartingEquipmentChoiceOptionChoose: (
			state,
			{
				payload: { choiceIndex, optionIndex, choose }
			}: PayloadAction<
				{
					choose?: number;
				} & WithOptionIndex
			>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].choose =
				choose;
		},
		setStartingEquipmentChoiceOptionEquipmentCategory: (
			state,
			{
				payload: { choiceIndex, optionIndex, equipmentCategory }
			}: PayloadAction<
				{
					equipmentCategory?: Item;
				} & WithOptionIndex
			>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			state.startingEquipmentChoices![choiceIndex].options[
				optionIndex
			].equipmentCategory = equipmentCategory;
		},
		addStartingEquipmentChoiceOptionItem: (
			state,
			{ payload: { choiceIndex, optionIndex } }: PayloadAction<WithOptionIndex>
		) => {
			prepStartingEquipmentChoiceOption(state, choiceIndex, optionIndex);

			if (
				!state.startingEquipmentChoices![choiceIndex].options[optionIndex].items
			) {
				state.startingEquipmentChoices![choiceIndex].options[
					optionIndex
				].items = [];
			}

			state.startingEquipmentChoices![choiceIndex].options[
				optionIndex
			].items!.push({ itemType: 'item' });
		},
		removeStartingEquipmentChoiceOptionItem: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex }
			}: PayloadAction<WithItemIndex>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items =
				state.startingEquipmentChoices![choiceIndex].options[
					optionIndex
				].items?.filter((_, i) => i !== itemIndex);

			if (
				state.startingEquipmentChoices![choiceIndex].options[optionIndex].items
					?.length === 0
			) {
				delete state.startingEquipmentChoices![choiceIndex].options[optionIndex]
					.items;
			}
		},
		setStartingEquipmentChoiceOptionItemType: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex, itemType }
			}: PayloadAction<
				{
					itemType: ItemType;
				} & WithItemIndex
			>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items![
				itemIndex
			] = { itemType };
		},
		setStartingEquipmentChoiceOptionItemCount: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex, count }
			}: PayloadAction<
				{
					count?: number;
				} & WithItemIndex
			>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items![
				itemIndex
			].count = count;
		},
		setStartingEquipmentChoiceOptionItemItem: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex, item }
			}: PayloadAction<
				{
					item?: Item;
				} & WithItemIndex
			>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items![
				itemIndex
			].item = item;
		},
		setStartingEquipmentChoiceOptionItemChoose: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex, choose }
			}: PayloadAction<
				{
					choose?: number;
				} & WithItemIndex
			>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items![
				itemIndex
			].choose = choose;
		},
		setStartingEquipmentChoiceOptionItemEquipmentCategory: (
			state,
			{
				payload: { choiceIndex, optionIndex, itemIndex, equipmentCategory }
			}: PayloadAction<
				{
					equipmentCategory?: Item;
				} & WithItemIndex
			>
		) => {
			prepStartingEquipmentChoiceOptionItem(
				state,
				choiceIndex,
				optionIndex,
				itemIndex
			);

			state.startingEquipmentChoices![choiceIndex].options[optionIndex].items![
				itemIndex
			].equipmentCategory = equipmentCategory;
		}
	}
});

export const {
	setName,
	setHitDie,
	setProficiencies,
	addProficiencyChoice,
	removeProficiencyChoice,
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
	setSpellSlotStyle,
	setKnowsCantrips,
	setHandleSpells,
	setSpellcastingSlotLevel,
	setSpellcastingNonLeveledSlots,
	setProficiencyBonus,
	addAbilityScoreBonusLevel,
	removeAbilityScoreBonusLevel,
	addStartingEquipment,
	removeStartingEquipment,
	setStartingEquipmentCount,
	setStartingEquipmentItem,
	addStartingEquipmentChoice,
	removeStartingEquipmentChoice,
	setStartingEquipmentChoiceChoose,
	addStartingEquipmentChoiceOption,
	setStartingEquipmentChoiceOptionType,
	removeStartingEquipmentChoiceOption,
	setStartingEquipmentChoiceOptionCount,
	setStartingEquipmentChoiceOptionItem,
	setStartingEquipmentChoiceOptionChoose,
	setStartingEquipmentChoiceOptionEquipmentCategory,
	addStartingEquipmentChoiceOptionItem,
	removeStartingEquipmentChoiceOptionItem,
	setStartingEquipmentChoiceOptionItemType,
	setStartingEquipmentChoiceOptionItemCount,
	setStartingEquipmentChoiceOptionItemItem,
	setStartingEquipmentChoiceOptionItemChoose,
	setStartingEquipmentChoiceOptionItemEquipmentCategory,
	setProficiencyChoiceChoose,
	addProficiencyChoiceOption,
	removeProficiencyChoiceOption,
	setProficiencyChoiceOptionType,
	setProficiencyChoiceOptionProficiency,
	setProficiencyChoiceOptionChoose,
	addProficiencyChoiceOptionSuboption,
	removeProficiencyChoiceOptionSuboption,
	setProficiencyChoiceOptionSuboptionProficiency,
	setProficiencyChoiceOptionProficiencyType,
	setProficiencyChoiceOptionSuboptionChoose,
	setProficiencyChoiceOptionSuboptionProficiencyType,
	setProficiencyChoiceOptionSuboptionType
} = editingClassSlice.actions;

export default editingClassSlice.reducer;
