import { object, string, number, array, boolean } from 'yup';
import { Item } from '../types/db/item';

const spellSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(30, 'Name must be 30 characters or less')
		.required('Name is required'),
	level: number()
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
		index: string()
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
	}).required('School is required'),
	components: array()
		.of(
			string().test(
				'is-component',
				'Components can only be "V", "S", or "M"',
				function (value) {
					return !!value && /^(V|S|M)$/.test(value);
				}
			)
		)
		.required('Components are required')
		.min(1, 'Must have at least 1 component')
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
		.min(1, 'Description is required')
		.max(5000, 'Description cannot be longer than 5000 characters'),
	atHigherLevels: string()
		.optional()
		.max(2000, 'At higher levels cannot be longer than 2000 characters.')
});

export default spellSchema;
