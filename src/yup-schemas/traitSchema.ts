import { array, number, object, string } from 'yup';

const traitSchema = object({
	uuid: string()
		.required('UUID is required')
		.max(50, 'UUID cannot be longer than 50 characters'),
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
					.max(50, 'Proficiency id cannot be more than 50 characters long'),
				name: string()
					.required()
					.max(50, 'Proficiency name cannot be more than 50 characters long')
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
	})
		.optional()
		.default(undefined),
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
					.max(50, 'Spell option id cannot be more than 50 characters long'),
				name: string()
					.required()
					.max(50, 'Spell option name cannot be more than 50 characters long')
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
						.max(50, 'Spell option id cannot be more than 50 characters long'),
					name: string()
						.required()
						.max(50, 'Spell option name cannot be more than 50 characters long')
				})
			)
			.min(1, 'Must have at least 1 spell to choose from')
			.required('Must have spells to choose from')
	})
		.optional()
		.default(undefined),
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
					uuid: string()
						.required('UUID is required')
						.max(50, 'UUID cannot be longer than 50 characters'),
					name: string()
						.required('Subtrait name is required')
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
						.max(5000, 'Description cannot be longer than 5000 characters'),
					proficiencies: array()
						.of(
							object({
								id: string()
									.required('Subtrait proficiency id is required')
									.max(
										50,
										'Subtrait proficiency id cannot be more than 50 characters long'
									),
								name: string()
									.required('Subtrait proficiency name is required')
									.max(
										50,
										'Subtrait proficiency name cannot be more than 50 characters long'
									)
							})
						)
						.optional(),
					proficiencyOptions: object({
						choose: number()
							.min(1, 'Cannot choose less than 1 subtrait proficiency option')
							.required('Must have number of subtrait proficiencies to choose')
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
					})
						.optional()
						.default(undefined),
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
					})
						.optional()
						.default(undefined)
				})
			)
			.required('Must have subtraits to choose from')
	})
		.optional()
		.default(undefined)
});

export default traitSchema;
