import { array, boolean, number, object, string } from 'yup';

import { Item } from '../types/db/item';

const spellSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(30, 'Name must be 30 characters or less')
		.required('Name is required'),
	level: number()
		.nullable()
		.test('is-not-null', 'Level is required', function (value) {
			return value !== null;
		})
		.integer('Level must be integer')
		.required('Level is required')
		.min(0, 'Level cannot be less than 0')
		.max(9, 'Level cannot be more than 9'),
	castingTime: string()
		.min(1, 'Casting time is required')
		.max(30, 'Casting time must be 30 characters or less')
		.required('Casting time is required'),
	duration: string()
		.min(1, 'Duration is required')
		.max(30, 'Duration must be 30 characters or less')
		.required('Duration is required'),
	range: string()
		.min(1, 'Range is required')
		.max(30, 'Range must be 30 characters or less')
		.required('Range is required'),
	school: object({
		name: string()
			.required('School name is required')
			.test(
				'is-spell-school',
				'School name must be one of Abjuration, Conjuration, Divination, Enchantment, Evocation, Necromancy, Illusion, or Transmutation',
				function (value) {
					return (
						!!value &&
						/^(Abjuration|Conjuration|Divination|Enchantment|Evocation|Necromancy|Illusion|Transmutation)$/.test(
							value
						)
					);
				}
			),
		id: string()
			.required('School index is required')
			.test(
				'is-spell-school',
				'School index must be one of Abjuration, Conjuration, Divination, Enchantment, Evocation, Necromancy, Illusion, or Transmutation',
				function (value) {
					return (
						!!value &&
						/^(abjuration|conjuration|divination|enchantment|evocation|necromancy|illusion|transmutation)$/.test(
							value
						)
					);
				}
			)
	})
		.required('School is required')
		.nullable()
		.test('is-not-null', 'School is required', function (value) {
			return value !== null;
		}),
	components: array()
		.nullable()
		.test('is-not-null', 'Components are required', function (value) {
			return value !== null;
		})
		.min(1, 'Must have at least 1 component')
		.of(
			string().test(
				'is-component',
				'Components can only be "V", "S", or "M"',
				function (value) {
					return !!value && ['V', 'S', 'M'].includes(value);
				}
			)
		)
		.required('Components are required')
		.test('no-repeats', 'Cannot repeat component values', function (value) {
			return (
				!!value &&
				value.reduce<{ isValid: boolean; values: string[] }>(
					(acc, cur) => {
						if (cur && acc.values.includes(cur)) {
							return {
								...acc,
								isValid: false
							};
						} else if (cur) {
							return {
								...acc,
								values: [...acc.values, cur]
							};
						} else {
							return acc;
						}
					},
					{
						isValid: true,
						values: []
					}
				).isValid
			);
		}),
	material: string().when('components', {
		is: (components: string[] | undefined) =>
			components && components.includes('M'),
		then: string()
			.required('Material is required')
			.min(1, 'Material is required')
			.max(60, 'Material must be 60 characters or less')
	}),
	classes: array()
		.of(
			object({
				name: string()
					.required('Class name is required')
					.min(1, 'Class name is required'),
				id: string()
					.required('Class ID is required')
					.min(1, 'Class ID is required')
			})
		)
		.min(1, 'Must select at least 1 class')
		.required('Classes are required')
		.test('no-repeats', 'Cannot repeat class values', function (value) {
			return (
				!!value &&
				[...value].reduce<{ isValid: boolean; values: Item[] }>(
					(acc, cur) => {
						if (cur && acc.values.some(val => val.id === cur.id)) {
							return {
								...acc,
								isValid: false
							};
						} else if (cur) {
							return {
								...acc,
								values: [...acc.values, cur as Item]
							};
						} else {
							return acc;
						}
					},
					{
						isValid: true,
						values: []
					}
				).isValid
			);
		}),
	concentration: boolean().required('Concentration is required'),
	ritual: boolean().required('Ritual is required'),
	description: string()
		.required('Description is required')
		.test('not-whitespace', 'Description is required', function (value) {
			return !!value && !/^\s*$/.test(value);
		})
		.min(1, 'Description is required')
		.max(5000, 'Description cannot be longer than 5000 characters'),
	atHigherLevels: string()
		.optional()
		.max(2000, 'At higher levels cannot be longer than 2000 characters.'),
	damageType: object({
		name: string()
			.required('Damage type must have name')
			.test(
				'valid-damage-type-name',
				'Damage type name must be one of Acid, Cold, Fire, Bludgeoning, Lightning, Necrotic, Force, Poison, Psychic, Piercing, Radiant, Slashing, Thunder',
				function (value) {
					return (
						!!value &&
						/^(Acid|Cold|Fire|Bludgeoning|Lightning|Necrotic|Force|Poison|Psychic|Piercing|Radiant|Slashing|Thunder)$/.test(
							value
						)
					);
				}
			),
		id: string()
			.required('Damage type must have id')
			.test(
				'valid-damage-type-id',
				'Damage type name must be one of acid, cold, fire, bludgeoning, lightning, necrotic, force, poison, psychic, piercing, radiant, slashing, thunder',
				function (value) {
					return (
						!!value &&
						/^(acid|cold|fire|bludgeoning|lightning|necrotic|force|poison|psychic|piercing|radiant|slashing|thunder)$/.test(
							value
						)
					);
				}
			)
	})
		.optional()
		.default(undefined)
});

export default spellSchema;
