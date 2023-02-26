import { array, boolean, number, object, string } from 'yup';
import { Item } from '../types/db/item';
import abilitySchema from './abilitySchema';
import featureSchema from './featureSchema';
import getItemSchema from './getItemSchema';

const startingEquipmentChoiceSchema = object({
	choose: number()
		.min(1, 'Cannot choose less than 1 option')
		.required('Must have number of options to choose')
		.test(
			'less-than-options',
			'Choose must be lower than the number of options',
			(value, context) => {
				if (!value) {
					return false;
				}

				const {
					parent: { options }
				} = <
					{
						parent: {
							options?: any[];
						};
					}
				>context;

				return value < (options?.length ?? 0);
			}
		),
	options: array()
		.of(
			object({
				optionType: string()
					.required('Option type is reuiqred')
					.oneOf(['item', 'category', 'multiple']),
				choose: number()
					.min(1, 'Cannot choose less than 1 option')
					.when('optionType', {
						is: 'category',
						then: schema => schema.required('Choose is required'),
						otherwise: schema => schema.optional().default(undefined)
					}),
				equipmentCategory: getItemSchema('Equipment category').when(
					'optionType',
					{
						is: 'category',
						then: schema => schema.required('Equipment category is required'),
						otherwise: schema => schema.optional().default(undefined)
					}
				),
				item: getItemSchema('Item').when('optionType', {
					is: 'item',
					then: schema => schema.required('Item is required'),
					otherwise: schema => schema.optional().default(undefined)
				}),
				count: number()
					.min(1, 'Count must be at least 1')
					.when('optionType', {
						is: 'item',
						then: schema => schema.required('Count is required'),
						otherwise: schema => schema.optional().default(undefined)
					}),
				items: array()
					.of(
						object({
							itemType: string()
								.required('Item type is reuiqred')
								.oneOf(['item', 'category']),
							choose: number()
								.min(1, 'Cannot choose less than 1 option')
								.when('itemType', {
									is: 'category',
									then: schema => schema.required('Choose is required'),
									otherwise: schema => schema.optional().default(undefined)
								}),
							equipmentCategory: getItemSchema('Equipment category').when(
								'itemType',
								{
									is: 'category',
									then: schema =>
										schema.required('Equipment Category is required'),
									otherwise: schema => schema.optional().default(undefined)
								}
							),
							item: getItemSchema('Item').when('itemType', {
								is: 'item',
								then: schema => schema.required('Item is required'),
								otherwise: schema => schema.optional().default(undefined)
							}),
							count: number()
								.min(1, 'Count must be at least 1')
								.when('itemType', {
									is: 'item',
									then: schema => schema.required('Count is required'),
									otherwise: schema => schema.optional().default(undefined)
								})
						})
					)
					.when('optionType', {
						is: 'multiple',
						then: schema => schema.required('Items are required'),
						otherwise: schema => schema.optional().default(undefined)
					})
					.min(1, 'Must have at least 1 item')
					.max(5, 'Cannot have more than 5 items')
			})
		)
		.min(1, 'There must be at least 1 option to choose from')
		.max(5, 'Cannot choose from more than 5 options')
		.required('Options are required')
});

const proficiencyChoiceSchema = object({
	choose: number()
		.min(1, 'Cannot choose less than 1 proficiency option')
		.required('Choose is required')
		.test(
			'less-than-options',
			'Choose must be lower than the number of options',
			(value, context) => {
				if (!value) {
					return false;
				}

				const {
					parent: { options }
				} = <
					{
						parent: {
							options?: any[];
						};
					}
				>context;

				return value < (options?.length ?? 0);
			}
		),
	options: array()
		.of(
			object({
				optionType: string()
					.required('Option type is required')
					.oneOf(
						['proficiency', 'choice', 'type'],
						'Option type must be one of "proficiency" or "choice"'
					),
				proficiency: getItemSchema('Proficiency').when('optionType', {
					is: 'proficiency',
					then: schema => schema.required('Proficiency is required'),
					otherwise: schema => schema.optional().default(undefined)
				}),
				proficiencyType: string()
					.max(50, 'Proficiency type cannot be longer than 50 characters')
					.when('optionType', {
						is: 'type',
						then: schema => schema.required('Proficiency type is required'),
						otherwise: schema => schema.optional().default(undefined)
					}),
				choose: number()
					.min(1, 'Choose cannot be less than 1')
					.test(
						'less-than-options',
						'Choose must be lower than the number of options',
						(value, context) => {
							const {
								parent: { options }
							} = <
								{
									parent: {
										options?: any[];
									};
								}
							>context;

							return (value ?? 0) < (options?.length ?? 0);
						}
					)
					.when('optionType', {
						is: 'choice',
						then: schema => schema.required('Choose is required'),
						otherwise: schema =>
							schema.when('optionType', {
								is: 'type',
								then: schema => schema.required('Choose is required'),
								otherwise: schema => schema.optional().default(undefined)
							})
					}),
				options: array()
					.of(
						object({
							optionType: string()
								.required('Option type is required')
								.oneOf(['proficiency', 'type']),
							proficiency: getItemSchema('Proficiency').when('optionType', {
								is: 'proficiency',
								then: schema => schema.required('Proficiency is required'),
								otherwise: schema => schema.optional().default(undefined)
							}),
							choose: number()
								.min(1, 'Choose cannot be less than 1')
								.when('optionType', {
									is: 'type',
									then: schema => schema.required('Choose is required'),
									otherwise: schema => schema.optional().default(undefined)
								}),
							proficiencyType: string()
								.max(50, 'Proficiency type cannot be longer than 50 characters')
								.when('optionType', {
									is: 'type',
									then: schema =>
										schema.required('Proficiency type is required'),
									otherwise: schema => schema.optional().default(undefined)
								})
						})
					)
					.min(1, 'Must have at least 1 option')
					.max(5, 'Cannot have more than 5 options')
					.when('optionType', {
						is: 'choice',
						then: schema => schema.required('Options are required'),
						otherwise: schema => schema.optional().default(undefined)
					})
			})
		)
		.required('Must have proficiencies to choose from')
		.min(1, 'Must have at least 1 proficiency to choose from')
		.max(5, 'Cannot have more than 5 proficiency Options')
});

const editingClassSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(50, 'Name must be 50 characters or less')
		.required('Name is required'),
	hitDie: number()
		.required('Hit die is required')
		.oneOf([6, 8, 10, 12], 'Hit die must be 6, 8, 10, or 12'),
	proficiencies: array()
		.of(getItemSchema('Proficiency'))
		.min(1, 'Must have at least 1 proficiency')
		.max(20, 'Cannot have more than 20 proficiencies')
		.optional(),
	proficiencyChoices: array()
		.of(proficiencyChoiceSchema)
		.min(1, 'Must have at least 1 proficiency choice')
		.max(5, 'Cannot have more than 5 proficiency choices')
		.optional()
		.default(undefined),
	proficiencyBonuses: array()
		.of(number().min(1, 'Proficiency bonus must be at least 1'))
		.length(20, 'Must have 1 proficiency bonus for each level')
		.required('Proficiency bonuses are required'),
	abilityScoreBonusLevels: array()
		.of(
			number()
				.min(1, 'Ability score bonus level cannot be less than 1')
				.max(20, 'Ability score bonus level cannot be greater than 20')
		)
		.required('Ability score bonus levels are required')
		.test(
			'no-repeat-levels',
			'Ability score bonus levels cannot repeat',
			values =>
				!!values &&
				!values.reduce<{ viewed: number[]; hasRepeat: boolean }>(
					(acc, cur) =>
						acc.viewed.includes(cur as number)
							? { viewed: [...acc.viewed, cur as number], hasRepeat: true }
							: { ...acc, viewed: [...acc.viewed, cur as number] },
					{ viewed: [], hasRepeat: false }
				).hasRepeat
		),
	savingThrows: array()
		.of(abilitySchema)
		.length(2, 'Class must have 2 saving throws'),
	spellcasting: object({
		spellSlotStyle: string()
			.required('Spell slot style is required')
			.oneOf(
				['half', 'full', 'warlock'],
				'Spell slot style must be either "half", "full", or "warlock"'
			),
		handleSpells: string()
			.required('Handle Spells is required')
			.oneOf(
				['prepare', 'spells-known'],
				'Handle Spells must be either "prepare" or "spells-known"'
			),
		knowsCantrips: boolean().required('Knows cantrips is required'),
		usesSpellbook: boolean().when('handleSpells', {
			is: 'prepare',
			then: schema => schema.required('Uses spellbook is required'),
			otherwise: schema => schema.optional().default(undefined)
		}),
		ability: abilitySchema
			.required('Spellcasting ability required')
			.test(
				'mental-ability',
				'Ability must be Charisma, Wisdom, or Intelligence',
				value =>
					!!value &&
					(value.id === 'cha' || value.id === 'wis' || value.id === 'int')
			),
		spells: array()
			.of(
				object({
					id: string()
						.required()
						.max(50, 'Spell id cannot be more than 50 characters long'),
					name: string()
						.required()
						.max(50, 'Spell name cannot be more than 50 characters long')
				})
			)
			.min(1, 'Must have at least 1 spell')
			.required('Spells are required')
			.test('no-repeats', 'Cannot have multiple of the same spell', values => {
				if (!values) {
					return false;
				}

				return !values.reduce<{
					checkedSpells: Partial<Item>[];
					hasRepeat: boolean;
				}>(
					(acc, cur) =>
						acc.checkedSpells.some(spell => spell.id === cur.id)
							? { checkedSpells: [...acc.checkedSpells, cur], hasRepeat: true }
							: { ...acc, checkedSpells: [...acc.checkedSpells, cur] },
					{ checkedSpells: [], hasRepeat: false }
				).hasRepeat;
			}),
		levels: array()
			.of(
				object({
					spellsKnown: number().min(1, 'Must know at least 1 spell').nullable(),
					cantrips: number().min(1, 'Must have at least 1 cantrip').nullable(),
					slotLevel: number()
						.min(1, 'Slot level must be atl east 1')
						.max(9, 'Slot level cannot be larger than 9')
						.nullable(),
					slots: number().min(1, 'Must have at least 1 spell slot').nullable(),
					level1: number()
						.min(1, 'Level 1 spell slot must be greater than or equal to 1')
						.nullable(),
					level2: number()
						.min(1, 'Level 2 spell slot must be greater than or equal to 1')
						.nullable(),
					level3: number()
						.min(1, 'Level 3 spell slot must be greater than or equal to 1')
						.nullable(),
					level4: number()
						.min(1, 'Level 4 spell slot must be greater than or equal to 1')
						.nullable(),
					level5: number()
						.min(1, 'Level 5 spell slot must be greater than or equal to 1')
						.nullable(),
					level6: number()
						.min(1, 'Level 6 spell slot must be greater than or equal to 1')
						.nullable(),
					level7: number()
						.min(1, 'Level 7 spell slot must be greater than or equal to 1')
						.nullable(),
					level8: number()
						.min(1, 'Level 8 spell slot must be greater than or equal to 1')
						.nullable(),
					level9: number()
						.min(1, 'Level 9 spell slot must be greater than or equal to 1')
						.nullable()
				})
			)
			.required('Spell slots and cantrips are required')
			.length(
				20,
				'Must have 20 spell slot and cantrip numbers, one for each class level'
			)
			.test(
				'earlier-levels-not-larger-than-higher-levels',
				'Values for levels must be less than or equal to the following level',
				value => {
					if (!value) {
						return false;
					}

					for (let i = 0; i < value.length - 1; ++i) {
						if (
							(value[i].spellsKnown ?? 0) > (value[i + 1].spellsKnown ?? 0) ||
							(value[i].cantrips ?? 0) > (value[i + 1].cantrips ?? 0) ||
							(value[i].slotLevel ?? 0) > (value[i + 1].slotLevel ?? 0) ||
							(value[i].slots ?? 0) > (value[i + 1].slots ?? 0) ||
							(value[i].level1 ?? 0) > (value[i + 1].level1 ?? 0) ||
							(value[i].level2 ?? 0) > (value[i + 1].level2 ?? 0) ||
							(value[i].level3 ?? 0) > (value[i + 1].level3 ?? 0) ||
							(value[i].level4 ?? 0) > (value[i + 1].level4 ?? 0) ||
							(value[i].level5 ?? 0) > (value[i + 1].level5 ?? 0) ||
							(value[i].level6 ?? 0) > (value[i + 1].level6 ?? 0) ||
							(value[i].level7 ?? 0) > (value[i + 1].level7 ?? 0) ||
							(value[i].level8 ?? 0) > (value[i + 1].level8 ?? 0) ||
							(value[i].level9 ?? 0) > (value[i + 1].level9 ?? 0)
						) {
							return false;
						}
					}

					return true;
				}
			)
	})
		.optional()
		.default(undefined),
	startingEquipment: array()
		.of(
			object({
				count: number()
					.required('Count is required')
					.min(1, 'Count must be at least 1'),
				item: getItemSchema('Item').required('Item is required')
			})
		)
		.required('Starting equipment is required')
		.min(1, 'Must have at least 1 starting equipment')
		.max(10, 'Cannot have more than 10 starting equipments'),
	startingEquipmentChoices: array()
		.of(startingEquipmentChoiceSchema)
		.min(1, 'Must have at least 1 starting equipment option')
		.max(5, 'Cannot have more than 5 starting equipment options')
		.optional()
		.default(undefined),
	features: array()
		.of(featureSchema)
		.required('Features are required')
		.min(1, 'Must have at least 1 feature')
		.max(20, 'Cannot have more than 20 features')
		.test(
			'valid-per-levels',
			'Cannot have more than 5 total per level infos',
			value => {
				if (!value) {
					return false;
				}

				return (
					value.reduce(
						(acc, cur) =>
							acc +
							(cur.perLevelBonuses?.length ?? 0) +
							(cur.perLevelDice?.length ?? 0) +
							(cur.perLevelDistances?.length ?? 0) +
							(cur.perLevelMultiDice?.length ?? 0) +
							(cur.perLevelNumbers?.length ?? 0),
						0
					) <= 5
				);
			}
		),
	subclassFlavor: string().required('Subclass flavor text is required'),
	subclassLevels: array()
		.of(
			number()
				.min(1, 'Subclass level cannot be less than 1')
				.max(20, 'Subclass level cannot be more than 20')
		)
		.required('Subclass levels are required')
		.length(5, 'Must have 5 subclass levels'),
	multiclassing: object({
		prerequisiteOptions: array().of(
			object({
				ability: abilitySchema.required('Prerequisite ability is required'),
				minimumScore: number()
					.required('Prerequisite minimum score is is required')
					.min(1, 'Minimum score cannot be lower than 1')
					.max(30, 'Minimum score cannot be higher than 30')
			})
		),
		proficiencies: array()
			.of(getItemSchema('Proficiency'))
			.required('Multiclassing proficiencies are required')
			.min(1, 'Must have at least 1 multiclassing proficiency')
			.max(20, 'Cannot have more than 20 multiclassing proficiencies'),
		proficiencyChoices: array()
			.of(proficiencyChoiceSchema)
			.min(1, 'Must have at least 1 multiclassing proficiency choice')
			.max(5, 'Cannot have more than 20 multiclassing proficiency choices')
			.optional()
			.default(undefined)
	}).required('Multiclassing is required')
});

export default editingClassSchema;
