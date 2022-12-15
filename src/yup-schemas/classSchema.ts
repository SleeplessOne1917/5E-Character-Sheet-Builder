import { array, mixed, number, object, string } from 'yup';
import abilitySchema from './abilitySchema';

const validateIsEquipmentCategory = (value: any) =>
	value.equipmentCategory &&
	typeof value.equipmentCategory === 'string' &&
	value.choose &&
	typeof value.choose === 'number' &&
	Object.keys(value).length === 2;

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
							options: any[];
						};
					}
				>context;

				return value < options.length;
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
							options: any[];
						};
					}
				>context;

				return value < options.length;
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
										options: any[];
									};
								}
							>context;

							return (value ?? 0) < options.length;
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
	savingThrows: array()
		.of(abilitySchema)
		.length(2, 'Class must have 2 saving throws'),
	spellcasting: object({
		level: number()
			.required('Spellcasting level required')
			.test(
				'valid-spellcasting-level',
				'Spellcasting level must be between 1 and 20 inclusive',
				value => !!value && (value >= 1 || value <= 20)
			),
		ability: abilitySchema.required('Spellcasting ability required')
	})
		.optional()
		.default(undefined),
	startingEquipment: array()
		.of(
			object({
				quantity: number()
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
