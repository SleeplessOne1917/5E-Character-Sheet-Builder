import { array, number, object, string } from 'yup';

import abilitySchema from './abilitySchema';
import getItemSchema from './getItemSchema';

const subclassSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(50, 'Name must be 50 characters or less')
		.required('Name is required'),
	features: array()
		.of(
			object({
				uuid: string()
					.required('UUID is required')
					.max(50, 'UUID cannot be longer than 50 characters'),
				name: string()
					.required('Name is required')
					.max(50, 'Name cannot be more than 50 characters long'),
				description: string()
					.required('Description is required')
					.test(
						'not-whitespace',
						'Description is required',
						value => !!value && !/^\s*$/.test(value)
					)
					.min(1, 'Description is required')
					.max(5000, 'Description cannot be longer than 5000 characters'),
				level: number()
					.required('Level is required')
					.min(1, 'Level cannot be lower than 1')
					.max(20, 'Level cannot be more than 20')
			})
		)
		.min(5, 'Must have at least 5 subclass features')
		.max(10, 'Cannot have more than 10 subclass features')
		.required('Subclass features'),
	spellcasting: object({
		cantrips: array()
			.of(getItemSchema('Cantrip'))
			.min(1, 'Minimum of 1 cantrip')
			.max(5, 'Cannot have more than 5 cantrips')
			.optional()
			.default(undefined),
		ability: abilitySchema
			.required('Spellcasting ability required')
			.test(
				'mental-ability',
				'Ability must be Charisma, Wisdom, or Intelligence',
				value =>
					!!value &&
					(value.id === 'cha' || value.id === 'wis' || value.id === 'int')
			),
		spellClass: getItemSchema('Spell Class').required(
			'Spell class is required'
		),
		spellSchools: array()
			.of(getItemSchema('Spell School'))
			.length(2, 'Must have 2 spell schools')
			.required('Spell schools are required'),
		levels: array()
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
							(value[i].level1 ?? 0) > (value[i + 1].level1 ?? 0) ||
							(value[i].level2 ?? 0) > (value[i + 1].level2 ?? 0) ||
							(value[i].level3 ?? 0) > (value[i + 1].level3 ?? 0) ||
							(value[i].level4 ?? 0) > (value[i + 1].level4 ?? 0)
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
	spellsByLevel: array()
		.of(
			object({
				level: number()
					.min(1, 'Level cannot be less than 1')
					.max(20, 'Level cannot be less than 20')
					.required('Level is required'),
				spells: array()
					.of(getItemSchema('Spell'))
					.min(1, 'Must have at least 1 spell')
					.max(5, 'Cannot have more than 5 spells')
					.required('Spells are required')
			})
		)
		.optional()
		.default(undefined)
}).test(
	'valid-spell',
	'Cannot have both spellcasting and spells by level',
	value => !!value && !(value.spellcasting && value.spellsByLevel)
);

export default subclassSchema;
