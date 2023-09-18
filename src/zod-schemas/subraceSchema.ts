import abilitySchema from './abilitySchema';
import languageSchema from './languageSchema';
import traitSchema from './traitSchema';
import { z } from 'zod';
import makeObjectSchema from './utils/makeObjectSchema';
import sizeSchema from './sizeSchema';

export default z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.trim()
			.nonempty('Name is required')
			.max(50, 'Name must be 50 characters or less'),
		race: makeObjectSchema('Race'),
		overrides: z
			.object({
				abilityBonuses: z.boolean().optional().default(false),
				abilityBonusOptions: z.boolean().optional().default(false),
				languages: z.boolean().optional().default(false),
				numberOfLanguageOptions: z.boolean().optional().default(false),
				size: z.boolean().optional().default(false),
				speed: z.boolean().optional().default(false)
			})
			.optional(),
		abilityBonuses: z
			.array(
				z.object({
					abilityScore: abilitySchema,
					bonus: z
						.number({ required_error: 'Ability bonus is required' })
						.min(-10, 'Ability bonus cannot be lower than -10')
						.max(10, 'Ability bonus cannot be higher than 10')
				})
			)
			.refine(abilityBonuses => {
				const alreadySeen: string[] = [];

				for (const {
					abilityScore: { id }
				} of abilityBonuses) {
					if (alreadySeen.includes(id)) {
						return false;
					}

					alreadySeen.push(id);
				}

				return true;
			}, 'Cannot repeat ability bonuses')
			.optional()
			.nullable(),
		abilityBonusOptions: z
			.object({
				bonus: z
					.number({ required_error: 'Bonus is required' })
					.min(-10, 'Bonus cannot be lower than -10')
					.max(10, 'Bonus cannot be higher than 10'),
				numberOfAbilityScores: z
					.number({ required_error: 'Number of ability scores required' })
					.min(
						1,
						'Ability bonus options must apply to at least 1 ability score'
					)
			})
			.optional()
			.nullable(),
		languages: z
			.array(languageSchema)
			.min(1, 'Must have at least 1 language')
			.optional(),
		numberOfLanguageOptions: z.number().optional().nullable(),
		size: sizeSchema.optional(),
		speed: z
			.number()
			.min(5, 'Speed must be at least 5')
			.max(100, 'Speed cannot be higher than 100')
			.refine(speed => speed % 5 === 0, 'Speed must be divisible by 5')
			.optional(),
		omittedRaceTraits: z
			.array(
				z
					.string()
					.trim()
					.nonempty('Trait UUID cannot be empty string')
					.max(50, 'Trait UUID cannot be longer than 50 characters')
			)
			.optional(),
		traits: z
			.array(traitSchema)
			.min(1, 'Must have at least 1 trait')
			.max(10, 'Cannot have more than 10 traits')
			.optional()
	})
	.superRefine(
		(
			{
				overrides,
				abilityBonuses,
				abilityBonusOptions,
				languages,
				numberOfLanguageOptions,
				size,
				speed
			},
			ctx
		) => {
			if (overrides?.abilityBonuses && !abilityBonuses) {
				ctx.addIssue({
					path: ['abilityBonuses'],
					message:
						'Ability bonuses are required when overwriting ability bonuses',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}

			if (overrides?.abilityBonusOptions && !abilityBonusOptions) {
				ctx.addIssue({
					path: ['abilityBonusOptions'],
					message:
						'Ability bonus options are required when overwriting ability bonus options',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}

			if (overrides?.languages && !languages) {
				ctx.addIssue({
					path: ['languages'],
					message: 'Languages are required when overwriting languages',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}

			if (overrides?.numberOfLanguageOptions && !numberOfLanguageOptions) {
				ctx.addIssue({
					path: ['numberOfLanguageOptions'],
					message:
						'Number of language options are required when overwriting number of language options',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}

			if (overrides?.size && !size) {
				ctx.addIssue({
					path: ['size'],
					message: 'Size is required when overwriting size',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}

			if (overrides?.speed && !speed) {
				ctx.addIssue({
					path: ['speed'],
					message: 'Speed is required when overwriting speed',
					code: z.ZodIssueCode.custom,
					fatal: true
				});
			}
		}
	);
