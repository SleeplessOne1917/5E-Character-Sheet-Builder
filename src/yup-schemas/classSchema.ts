import { array, boolean, mixed, number, object, string } from 'yup';
import { Item } from '../types/db/item';
import abilitySchema from './abilitySchema';

const validateIsEquipmentCategory = (value: any) =>
	value.equipmentCategory &&
	typeof value.equipmentCategory === 'object' &&
	value.choose &&
	typeof value.choose === 'number' &&
	Object.keys(value).length === 2 &&
	value.item.id &&
	typeof value.equipmentCategory.id === 'string' &&
	value.item.name &&
	typeof value.equipmentCategory.name === 'string';

const validateIsItemAndCount = (value: any) =>
	value.count &&
	typeof value.count === 'number' &&
	value.item &&
	typeof value.item === 'object' &&
	Object.keys(value).length === 2 &&
	value.item.id &&
	typeof value.item.id === 'string' &&
	value.item.name &&
	typeof value.item.name === 'string';

const validateIsMultiple = (value: any) =>
	value.items &&
	Array.isArray(value.items) &&
	value.items.every(
		(item: any) =>
			validateIsEquipmentCategory(item) || validateIsItemAndCount(item)
	);

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
			mixed().test(
				'is-valid-option',
				'Options must be either object with "choose" and "equipmentCategory", "count" and "item", or "items" properties',
				value => {
					if (!value || typeof value !== 'object') {
						return false;
					}

					return (
						validateIsEquipmentCategory(value) ||
						validateIsItemAndCount(value) ||
						validateIsMultiple(value)
					);
				}
			)
		)
		.min(1, 'There must be at least 1 option to choose from')
});

const proficiencyChoiceSchema = object({
	choose: number()
		.min(1, 'Cannot choose less than 1 proficiency option')
		.required('Must have number of proficiencies to choose')
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
				id: string()
					.max(
						50,
						'Proficiency option id cannot be more than 50 characters long'
					)
					.optional()
					.default(undefined),
				name: string()
					.max(
						50,
						'Proficiency option name cannot be more than 50 characters long'
					)
					.optional()
					.default(undefined),
				choose: number()
					.min(1, 'Cannot choose less than 1 proficiency option')
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
					),
				options: array()
					.of(
						object({
							id: string()
								.max(
									50,
									'Proficiency option id cannot be more than 50 characters long'
								)
								.required('Proficiency ID required'),
							name: string()
								.max(
									50,
									'Proficiency option name cannot be more than 50 characters long'
								)
								.required('Proficiency name required')
						})
					)
					.optional()
					.default(undefined)
			}).test(
				'is-valid-proficiency-option',
				'Options must either have name and ID or choose and options',
				value => {
					if (!value) {
						return false;
					}

					return (
						(value.id && value.name) ||
						((value.choose || value.choose === 0) && value.options)
					);
				}
			)
		)
		.required('Must have proficiencies to choose from')
		.min(1, 'Must have at least 1 proficiency to choose from')
});

const proficiencySchema = object({
	id: string()
		.required()
		.max(50, 'Proficiency id cannot be more than 50 characters long'),
	name: string()
		.required()
		.max(50, 'Proficiency name cannot be more than 50 characters long')
});

const classSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(50, 'Name must be 50 characters or less')
		.required('Name is required'),
	hitDie: number()
		.required('Hit die is required')
		.test(
			'valid-hit-die',
			'Hit die must be 6, 8, 10, or 12',
			value =>
				!!value && (value === 6 || value === 8 || value === 10 || value === 12)
		),
	proficiencies: array()
		.of(proficiencySchema)
		.min(1, 'Must have at least 1 proficiency')
		.optional(),
	proficiencyChoices: array()
		.of(proficiencyChoiceSchema)
		.min(1, 'Must have at least 1 proficiency choice')
		.optional()
		.default(undefined),
	proficiencyBonuses: array()
		.of(number().min(1, 'Proficiency bonus must be at least 1'))
		.length(20, 'Must have 1 proficiency bonus for each level')
		.required('Proficiency bonuses are required'),
	savingThrows: array()
		.of(abilitySchema)
		.length(2, 'Class must have 2 saving throws'),
	spellcasting: object({
		level: number()
			.required('Spellcasting level required')
			.test(
				'valid-spellcasting-level',
				'Spellcasting level must be 1 or 2',
				value => !!value && (value === 1 || value === 2)
			),
		isHalfCaster: boolean().required('isHalfCaster is required'),
		handleSpells: string()
			.required('Handle Spells is required')
			.test(
				'handle-spells-is-valid',
				'Handle Spells must be either "prepare" or "spells-known"',
				value => !!value && (value === 'prepare' || value === 'spells-known')
			),
		knowsCantrips: boolean().required('Knows Cantrips is required'),
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
		spellSlotsAndCantripsPerLevel: array()
			.of(
				object({
					spellsKnown: number().min(1, 'Must know at least 1 spell').nullable(),
					cantrips: number().min(1, 'Must have at least 1 cantrip').nullable(),
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
				'Cannot have more spells slots in a level lower than a level with fewer spell slots.',
				value => {
					if (!value) {
						return false;
					}

					for (let i = 0; i < value.length - 1; ++i) {
						if (
							(value[i].spellsKnown ?? 0) > (value[i + 1].spellsKnown ?? 0) ||
							(value[i].cantrips ?? 0) > (value[i + 1].cantrips ?? 0) ||
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
					.required('Quantity is required')
					.min(1, 'Quantity must be at least 1'),
				item: object({
					id: string()
						.required()
						.max(50, 'Item id cannot be more than 50 characters long'),
					name: string()
						.required()
						.max(50, 'Item name cannot be more than 50 characters long')
				}).required('Item is required')
			})
		)
		.required('Starting equipment is required')
		.min(1, 'Must have at least 1 starting equipment'),
	startingEquipmentOptions: array()
		.of(startingEquipmentChoiceSchema)
		.optional()
		.default(undefined),
	subclassFlavor: string().required('Subclass flavor text is required'),
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
			.of(proficiencySchema)
			.required('Multiclassing proficiencies are required')
			.min(1, 'Must have at least 1 multiclassing proficiency'),
		proficiencyChoices: array()
			.of(proficiencyChoiceSchema)
			.min(1, 'Must have at least 1 multiclassing proficiency choice')
			.optional()
			.default(undefined)
	}).required('Multiclassing is required')
});

export default classSchema;
