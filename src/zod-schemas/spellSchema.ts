import { z } from 'zod';

import summonsSchema from './summonsSchema';
import makeObjectLiteralSchema from './utils/makeObjectLiteralSchema';

const spellSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.nonempty('Name is required')
		.max(50, 'Name must be 50 characters or less'),
	level: z
		.number({ required_error: 'Level is required' })
		.int('Level must be integer')
		.min(0, 'Level cannot be less than 0')
		.max(9, 'Level cannot be more than 9'),
	castingTime: z
		.string({ required_error: 'Casting time is required' })
		.trim()
		.nonempty('Casting time is required')
		.max(30, 'Casting time must be 30 characters or less'),
	duration: z
		.string({ required_error: 'Duration is required' })
		.trim()
		.nonempty('Duration is required')
		.max(30, 'Duration must be 30 characters or less'),
	range: z
		.string({ required_error: 'Range is required' })
		.trim()
		.nonempty('Range is required')
		.max(30, 'Range must be 30 characters or less'),
	school: z.union(
		[
			makeObjectLiteralSchema('abjuration', 'Abjuration'),
			makeObjectLiteralSchema('conjuration', 'Conjuration'),
			makeObjectLiteralSchema('divination', 'Divination'),
			makeObjectLiteralSchema('enchantment', 'Enchantment'),
			makeObjectLiteralSchema('evocation', 'Evocation'),
			makeObjectLiteralSchema('necromancy', 'Necromancy'),
			makeObjectLiteralSchema('illusion', 'Illusion'),
			makeObjectLiteralSchema('transmutation', 'Transmutation')
		],
		{ required_error: 'School is required' }
	),
	components: z
		.array(z.union([z.literal('V'), z.literal('M'), z.literal('S')]), {
			required_error: 'Components are required'
		})
		.min(1, 'Must have at least 1 component')
		.max(3, 'Cannot have more than 3 components')
		.refine(
			components => new Set(components).size <= 3,
			'Cannot repeat component values'
		),
	material: z
		.string()
		.trim()
		.nonempty('Material is required')
		.max(100, 'Material must be 100 characters or less')
		.optional(),
	// TODO: fix this once summons are good
	// .when('components', {
	// 	is: (components: string[] | undefined) =>
	// 		components && components.includes('M'),
	// 	then: string()
	// 		.required('Material is required')
	// 		.min(1, 'Material is required')
	//
	// }),
	classes: z
		.array(
			z.object({
				name: z
					.string({ required_error: 'Class name is required' })
					.nonempty('Class name is required'),
				id: z
					.string({ required_error: 'Class ID is required' })
					.nonempty('Class ID is required')
			}),
			{ required_error: 'Classes are required' }
		)
		.min(1, 'Must select at least 1 class')
		.refine(classes => {
			const alreadyFound: string[] = [];

			for (const { id } of classes) {
				if (alreadyFound.includes(id)) {
					return false;
				}

				alreadyFound.push(id);
			}

			return true;
		}, 'Cannot repeat class values'),
	concentration: z.boolean({ required_error: 'Concentration is required' }),
	ritual: z.boolean({ required_error: 'Ritual is required' }),
	description: z
		.string({ required_error: 'Description is required' })
		.trim()
		.nonempty('Description is required')
		.max(5000, 'Description cannot be longer than 5000 characters'),
	atHigherLevels: z
		.string()
		.trim()
		.max(2000, 'At higher levels cannot be longer than 2000 characters.')
		.optional(),
	damageType: z
		.union([
			makeObjectLiteralSchema('acid', 'Acid'),
			makeObjectLiteralSchema('cold', 'Cold'),
			makeObjectLiteralSchema('fire', 'Fire'),
			makeObjectLiteralSchema('bludgeoning', 'Bludgeoning'),
			makeObjectLiteralSchema('lightning', 'Lightning'),
			makeObjectLiteralSchema('necrotic', 'Necrotic'),
			makeObjectLiteralSchema('force', 'Force'),
			makeObjectLiteralSchema('poison', 'Poison'),
			makeObjectLiteralSchema('psychic', 'Psychic'),
			makeObjectLiteralSchema('piercing', 'Piercing'),
			makeObjectLiteralSchema('radiant', 'Radiant'),
			makeObjectLiteralSchema('slashing', 'Slashing'),
			makeObjectLiteralSchema('thunder', 'Thunder')
		])

		.optional(),
	summons: summonsSchema
});

export default spellSchema;
