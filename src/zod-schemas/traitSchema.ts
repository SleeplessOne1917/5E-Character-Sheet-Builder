import { z } from 'zod';

const traitSchema = z.object({
	uuid: z
		.string({ required_error: 'UUID is required' })
		.trim()
		.nonempty('UUID is required')
		.max(50, 'UUID cannot be longer than 50 characters'),
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.nonempty('Name is required')
		.max(50, 'Name cannot be more than 50 characters long'),
	description: z
		.string({ required_error: 'Description is required' })
		.trim()
		.nonempty('Description is required')
		.max(5000, 'Description cannot be longer than 5000 characters'),
	proficiencies: z
		.array(
			z.object({
				id: z
					.string()
					.max(50, 'Proficiency id cannot be more than 50 characters long'),
				name: z
					.string()
					.max(50, 'Proficiency name cannot be more than 50 characters long')
			})
		)
		.min(1, 'Must have at least 1 proficiency')
		.optional(),
	proficiencyOptions: z
		.object({
			choose: z
				.number({
					required_error: 'Number of proficiencies to choose from required'
				})
				.min(1, 'Cannot choose less than 1 proficiency option'),
			options: z
				.array(
					z.object({
						id: z
							.string()
							.max(
								50,
								'Proficiency option id cannot be more than 50 characters long'
							),
						name: z
							.string()
							.max(
								50,
								'Proficiency option name cannot be more than 50 characters long'
							)
					}),
					{ required_error: 'Must have proficiencies to choose from' }
				)
				.min(1, 'Must have at least 1 proficiency to choose from')
		})
		.refine(({ choose, options }) => choose < options.length, {
			path: ['choose'],
			message: 'Choose must be lower than the number of options'
		})
		.optional(),
	hpBonusPerLevel: z
		.number()
		.min(1, 'HP bonus cannot be lower than 1')
		.max(10, 'HP bonus cannot be more than 10')
		.optional(),
	spells: z
		.array(
			z.object({
				id: z
					.string()
					.max(50, 'Spell option id cannot be more than 50 characters long'),
				name: z
					.string()
					.max(50, 'Spell option name cannot be more than 50 characters long')
			})
		)
		.min(1, 'Must have at least 1 spell if spells is specified')
		.optional(),
	spellOptions: z
		.object({
			choose: z
				.number({ required_error: 'Number of spells to choose from required' })
				.min(1, 'Cannot choose less than 1 spell option'),
			options: z
				.array(
					z.object({
						id: z
							.string()
							.max(
								50,
								'Spell option id cannot be more than 50 characters long'
							),
						name: z
							.string()
							.max(
								50,
								'Spell option name cannot be more than 50 characters long'
							)
					}),
					{ required_error: 'Must have spells to choose from' }
				)
				.min(1, 'Must have at least 1 spell to choose from')
		})
		.refine(({ choose, options }) => choose < options.length, {
			path: ['choose'],
			message: 'Choose must be lower than the number of options'
		})
		.optional()
});

export default traitSchema.extend({
	subtraitOptions: z
		.object({
			choose: z
				.number({
					required_error: 'Number of proficiencies to choose from required'
				})
				.min(1, 'Cannot choose less than 1 proficiency option'),
			options: z
				.array(traitSchema, {
					required_error: 'Must have subtraits to choose from'
				})
				.min(1, 'Must have at least 1 subtrait to choose from')
		})
		.refine(({ choose, options }) => choose < options.length, {
			path: ['choose'],
			message: 'Choose must be lower than the number of options'
		})
		.optional()
});
