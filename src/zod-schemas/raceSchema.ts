import abilitySchema from './abilitySchema';
import languageSchema from './languageSchema';
import traitSchema from './traitSchema';
import { z } from 'zod';
import sizeSchema from './sizeSchema';

export default z
	.object({
		name: z
			.string({ required_error: 'Name is required' })
			.trim()
			.nonempty('Name is required')
			.max(50, 'Name must be 50 characters or less'),
		abilityBonuses: z
			.array(
				z.object({
					abilityScore: abilitySchema,
					bonus: z
						.number({ required_error: 'Ability bonus must have bonus' })
						.min(-10, 'Ability bonus cannot be lower than -10')
						.max(10, 'Ability bonus cannot be higher than 10')
				})
			)
			.nonempty('Ability bonuses cannot be empty')
			.refine(bonuses => {
				const checked: string[] = [];

				for (const {
					abilityScore: { id }
				} of bonuses) {
					if (checked.includes(id)) {
						return false;
					}

					checked.push(id);
				}

				return true;
			}, 'Cannot repeat ability bonuses')
			.optional(),
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
			.optional(),
		languages: z
			.array(languageSchema, { required_error: 'Languages are required' })
			.min(1, 'Must have at least 1 language'),
		numberOfLanguageOptions: z
			.number()

			.optional(),
		size: sizeSchema,
		speed: z
			.number({ required_error: 'Speed is required' })
			.min(5, 'Speed must be at least 5')
			.max(100, 'Speed cannot be higher than 100')
			.refine(value => value % 5 === 0, 'Speed must be divisible by 5'),
		traits: z
			.array(traitSchema)
			.max(10, 'Cannot have more than 10 traits')
			.optional()
	})
	.refine(
		({ abilityBonuses, abilityBonusOptions }) => {
			if (!abilityBonuses || abilityBonuses.length === 0) {
				return (
					abilityBonusOptions && abilityBonusOptions.numberOfAbilityScores > 0
				);
			}

			return true;
		},
		{
			message: 'Must have at least one ability bonus',
			path: ['abilityBonuses']
		}
	)
	.refine(
		({ abilityBonusOptions, abilityBonuses }) => {
			if (!abilityBonusOptions) {
				return true;
			}

			return (
				abilityBonusOptions.numberOfAbilityScores <=
				6 - (abilityBonuses?.length ?? 0)
			);
		},
		{
			message:
				'Sum of number of abilityBonuses and abilityScores must be less than or equal to 6',
			path: ['abilityBonusOptions']
		}
	)
	.refine(
		({ languages, numberOfLanguageOptions }) =>
			!numberOfLanguageOptions ||
			numberOfLanguageOptions <= 16 - languages.length,
		{
			message:
				'Sum of number of languages and numberOfLanguageOptions must be less than or equal to 16',
			path: ['numberOfLanguageOptions']
		}
	);
