import { array, InferType, number, object, string } from 'yup';
import { SIZES } from '../constants/sizeConstants';

const abilitySchema = object({
	id: string().required('Ability id is required'),
	name: string().required('Ability name required')
}).test(
	'ability-is-valid',
	'Ability id must be one of "str", "dex", "con", "cha", "int", or "wis"',
	value =>
		!!value &&
		!!value.id &&
		!!value.name &&
		((value.id === 'str' && value.name === 'Strength') ||
			(value.id === 'dex' && value.name === 'Dexterity') ||
			(value.id === 'con' && value.name === 'Constitution') ||
			(value.id === 'cha' && value.name === 'Charisma') ||
			(value.id === 'int' && value.name === 'Intelligence') ||
			(value.id === 'wis' && value.name === 'Wisdom'))
);

const languageSchema = object({
	id: string().required('Language id is required'),
	name: string().required('Language name is required')
}).test(
	'language-is-valid',
	'Language must be one of "infernal", "goblin", "primordial", "sylvan", "common", "halfling", "celestial", "draconic", "dwarvish", "elvish", "gnomish", "orc", "abyssal", "deep-speech", "giant", or "undercommon"',
	value =>
		!!value &&
		!!value.id &&
		!!value.name &&
		((value.id === 'infernal' && value.name === 'Infernal') ||
			(value.id === 'goblin' && value.name === 'Goblin') ||
			(value.id === 'primordial' && value.name === 'Primordial') ||
			(value.id === 'sylvan' && value.name === 'Sylvan') ||
			(value.id === 'common' && value.name === 'Common') ||
			(value.id === 'halfling' && value.name === 'Halfling') ||
			(value.id === 'celestial' && value.name === 'Celestial') ||
			(value.id === 'draconic' && value.name === 'Draconic') ||
			(value.id === 'dwarvish' && value.name === 'Dwarvish') ||
			(value.id === 'elvish' && value.name === 'Elvish') ||
			(value.id === 'gnomish' && value.name === 'Gnomish') ||
			(value.id === 'orc' && value.name === 'Orc') ||
			(value.id === 'abyssal' && value.name === 'Abyssal') ||
			(value.id === 'deep-speech' && value.name === 'Deep Speech') ||
			(value.id === 'giant' && value.name === 'Giant') ||
			(value.id === 'undercommon' && value.name === 'Undercommon'))
);

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
					return false;
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
		.optional(),
	languages: array()
		.of(languageSchema)
		.required('Languages are required')
		.min(1, 'Must have at least 1 language'),
	numLanguageOptions: number()
		.test(
			'sum-less-than-16',
			'Sum of number of languages and numLanguageOptions must be less than or equal to 16',
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
		.of(
			object({
				name: string()
					.required('Trait name is required')
					.max(50, 'Trait name cannot be more than 50 characters long'),
				description: string()
					.required('Description is required')
					.test(
						'not-whitespace',
						'Description is required',
						value => !!value && !/^\s*$/.test(value)
					)
					.min(1, 'Description is required')
					.max(5000, 'Description cannot be longer than 5000 characters'),
				proficiencies: array()
					.of(
						object({
							id: string()
								.required()
								.max(
									50,
									'Proficiency id cannot be more than 50 characters long'
								),
							name: string()
								.required()
								.max(
									50,
									'Proficiency name cannot be more than 50 characters long'
								)
						})
					)
					.min(1, 'Must have at least 1 proficiency')
					.optional(),
				proficiencyOptions: object({
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
									.required()
									.max(
										50,
										'Proficiency option id cannot be more than 50 characters long'
									),
								name: string()
									.required()
									.max(
										50,
										'Proficiency option name cannot be more than 50 characters long'
									)
							})
						)
						.required('Must have proficiencies to choose from')
						.min(1, 'Must have at least 1 proficiency to choose from')
				}).optional(),
				hpBonusPerLevel: number()
					.min(1, 'HP bonus cannot be lower than 1')
					.max(10, 'HP bonus cannot be more than 10')
					.optional()
					.nullable(),
				spells: array()
					.of(
						object({
							id: string()
								.required()
								.max(
									50,
									'Spell option id cannot be more than 50 characters long'
								),
							name: string()
								.required()
								.max(
									50,
									'Spell option name cannot be more than 50 characters long'
								)
						})
					)
					.min(1, 'Must have at least 1 spell if spells is specified')
					.nullable()
					.optional(),
				spellOptions: object({
					choose: number()
						.min(1, 'Cannot choose less than 1 spell option')
						.required('Must have number of spells to choose')
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
									.required()
									.max(
										50,
										'Spell option id cannot be more than 50 characters long'
									),
								name: string()
									.required()
									.max(
										50,
										'Spell option name cannot be more than 50 characters long'
									)
							})
						)
						.min(1, 'Must have at least 1 spell to choose from')
						.required('Must have spells to choose from')
				}).optional(),
				subtraitOptions: object({
					choose: number()
						.min(1, 'Cannot choose less than 1 subtrait option')
						.required('Must have number of subtraits to choose')
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

								return (value ?? 0) < options.length;
							}
						),
					options: array()
						.of(
							object({
								name: string()
									.required()
									.max(
										50,
										'Subtrait option name cannot be more than 50 characters long'
									),
								description: string()
									.required('Description is required')
									.test(
										'not-whitespace',
										'Description is required',
										value => !!value && !/^\s*$/.test(value)
									)
									.min(1, 'Description is required')
									.max(
										5000,
										'Description cannot be longer than 5000 characters'
									),
								proficiencies: array()
									.of(
										object({
											id: string()
												.required()
												.max(
													50,
													'Subtrait proficiency id cannot be more than 50 characters long'
												),
											name: string()
												.required()
												.max(
													50,
													'Subtrait proficiency name cannot be more than 50 characters long'
												)
										})
									)
									.optional(),
								proficiencyOptions: object({
									choose: number()
										.min(
											1,
											'Cannot choose less than 1 subtrait proficiency option'
										)
										.required(
											'Must have number of subtrait proficiencies to choose'
										)
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

												return (value ?? 0) < options.length;
											}
										),
									options: array()
										.of(
											object({
												id: string()
													.required()
													.max(
														50,
														'Subtrait proficiency option id cannot be more than 50 characters long'
													),
												name: string()
													.required()
													.max(
														50,
														'Subtrait proficiency option name cannot be more than 50 characters long'
													)
											})
										)
										.required('Must have proficiencies to choose from')
								}).optional(),
								hpBonusPerLevel: number()
									.min(1, 'Subtrait HP bonus cannot be lower than 1')
									.max(10, 'Subtrait HP bonus cannot be more than 10')
									.optional(),
								spells: array()
									.of(
										object({
											id: string()
												.required()
												.max(
													50,
													'Spell option id cannot be more than 50 characters long'
												),
											name: string()
												.required()
												.max(
													50,
													'Spell option name cannot be more than 50 characters long'
												)
										})
									)
									.min(1, 'Must have at least 1 spell if spells is specified')
									.nullable()
									.optional(),
								spellOptions: object({
									choose: number()
										.min(1, 'Cannot choose less than 1 subtrait spell option')
										.required('Must have number of subtrait spells to choose')
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

												return (value ?? 0) < options.length;
											}
										),
									options: array()
										.of(
											object({
												id: string()
													.required()
													.max(
														50,
														'Subtrait spell option id cannot be more than 50 characters long'
													),
												name: string()
													.required()
													.max(
														50,
														'Subtrait spell option name cannot be more than 50 characters long'
													)
											})
										)
										.required('Must have subtrait spells to choose from')
								}).optional()
							})
						)
						.required('Must have subtraits to choose from')
				}).optional()
			})
		)
		.max(10, 'Cannot have more than 10 traits')
		.optional()
});

export default raceSchema;
