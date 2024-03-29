import { array, InferType, number, object, string } from 'yup';
import { SIZES } from '../constants/sizeConstants';
import abilitySchema from './abilitySchema';
import languageSchema from './languageSchema';
import traitSchema from './traitSchema';

const raceSchema = object({
	name: string()
		.min(1, 'Name is required')
		.max(50, 'Name must be 50 characters or less')
		.required('Name is required'),
	abilityBonuses: array()
		.of(
			object({
				abilityScore: abilitySchema.required(
					'Ability bonus must have ability score'
				),
				bonus: number()
					.required('Ability bonus must have bonus')
					.min(-10, 'Ability bonus cannot be lower than -10')
					.max(10, 'Ability bonus cannot be higher than 10')
			})
		)
		.required('Ability bonuses are required')
		.test(
			'no-repeat-ability-bonuses',
			'Cannot repeat ability bonuses',
			value =>
				!!value &&
				!value.reduce<{
					containsRepeats: boolean;
					checkedValues: string[];
				}>(
					(acc, cur) => {
						if (cur.abilityScore.id && cur.abilityScore.name) {
							if (acc.checkedValues.some(id => id === cur.abilityScore.id)) {
								return {
									...acc,
									containsRepeats: true
								};
							} else {
								return {
									...acc,
									checkedValues: [...acc.checkedValues, cur.abilityScore.id]
								};
							}
						} else {
							return acc;
						}
					},
					{
						containsRepeats: false,
						checkedValues: []
					}
				).containsRepeats
		)
		.test(
			'has-ability-bonuses',
			'Must have at least one ability bonus',
			(value, context) => {
				if (!value) {
					return false;
				}

				const {
					parent: { abilityBonusOptions }
				} = <
					{
						parent: {
							abilityBonusOptions?: {
								numberOfAbilityScores: number;
								bonus: number;
							};
						};
					}
				>context;

				if (value.length === 0) {
					return (abilityBonusOptions?.bonus ?? 0) > 0;
				}

				return true;
			}
		),
	abilityBonusOptions: object({
		bonus: number()
			.min(-10, 'Bonus cannot be lower than -10')
			.max(10, 'Bonus cannot be higher than 10')
			.required('Bonus is required'),
		numberOfAbilityScores: number()
			.min(1, 'Ability bonus options must apply to at least 1 ability score')
			.required('Number of ability scores required')
	})
		.test(
			'sum-less-than-6',
			'Sum of number of abilityBonuses and abilityScores must be less than or equal to 6',
			(value, context) => {
				if (!value) {
					return true;
				}

				const {
					parent: { abilityBonuses }
				} = <
					{
						parent: {
							abilityBonuses?: {
								abilityScore: InferType<typeof abilitySchema>;
								bonus: number;
							}[];
						};
					}
				>context;
				const { numberOfAbilityScores } = value;

				// There are 6 abilities total
				return (
					(numberOfAbilityScores ?? 0) <= 6 - (abilityBonuses?.length ?? 0)
				);
			}
		)
		.optional()
		.default(undefined),
	languages: array()
		.of(languageSchema)
		.required('Languages are required')
		.min(1, 'Must have at least 1 language'),
	numberOfLanguageOptions: number()
		.test(
			'sum-less-than-16',
			'Sum of number of languages and numberOfLanguageOptions must be less than or equal to 16',
			(value, context) => {
				const {
					parent: { languages }
				} = <
					{
						parent: {
							languages: InferType<typeof languageSchema>[];
						};
					}
				>context;

				// There are 16 languages total
				return (value ?? 0) <= 16 - (languages?.length ?? 0);
			}
		)
		.optional(),
	size: string()
		.required('Race size is required')
		.test(
			'is-valid-size',
			'Race size must be one of "TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", or "GARGANTUAN"',
			value => !!value && SIZES.includes(value)
		),
	speed: number()
		.required('Speed is required')
		.min(5, 'Speed must be at least 5')
		.max(100, 'Speed cannot be higher than 100')
		.test(
			'divisible-by-five',
			'Speed must be divisible by 5',
			value => !!value && value % 5 === 0
		),
	traits: array()
		.of(traitSchema)
		.max(10, 'Cannot have more than 10 traits')
		.optional()
});

export default raceSchema;
