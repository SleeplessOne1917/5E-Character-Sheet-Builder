import { array, number, object, string } from 'yup';
import getItemSchema from './getItemSchema';

const featureSchema = object({
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
		.max(20, 'Level cannot be more than 20'),
	perLevelNumbers: array()
		.of(
			object({
				name: string()
					.required('Name is required')
					.min(1, 'Name is required')
					.max(50, 'Name cannot be longer than 50 characters'),
				levels: array()
					.of(number().min(1, 'Number must be at least 1').nullable())
					.length(20, 'Must have number for each level')
					.test(
						'is-ascending',
						'Values for levels cannot be smaller than the previous level',
						value => {
							if (!value) {
								return false;
							}

							for (let i = 0; i < value.length - 1; ++i) {
								if ((value[i] ?? 0) > (value[i + 1] ?? 0)) {
									return false;
								}
							}

							return true;
						}
					)
			})
		)
		.optional()
		.default(undefined),
	perLevelDice: array()
		.of(
			object({
				name: string()
					.required('Name is required')
					.min(1, 'Name is required')
					.max(50, 'Name cannot be longer than 50 characters'),
				levels: array()
					.of(
						number()
							.oneOf(
								[4, 6, 8, 10, 12],
								'Die must be one of "4", "6", "8", "10", or "12"'
							)
							.nullable()
					)
					.length(20, 'Must have a die for each level')
					.test(
						'is-ascending',
						'Values for levels cannot be smaller than the previous level',
						value => {
							if (!value) {
								return false;
							}

							for (let i = 0; i < value.length - 1; ++i) {
								if ((value[i] ?? 0) > (value[i + 1] ?? 0)) {
									return false;
								}
							}

							return true;
						}
					)
			})
		)
		.optional()
		.default(undefined),
	perLevelMultiDice: array()
		.of(
			object({
				name: string()
					.required('Name is required')
					.min(1, 'Name is required')
					.max(50, 'Name cannot be longer than 50 characters'),
				levels: array()
					.of(
						object({
							die: number()
								.required('Die is required')
								.oneOf(
									[4, 6, 8, 10, 12],
									'Die must be one of "4", "6", "8", "10", or "12"'
								)
								.optional()
								.default(undefined),
							count: number()
								.min(1, 'Count must be at least 1')
								.optional()
								.default(undefined)
						})
					)
					.length(20, 'Must have a value for each level')
					.test(
						'is-ascending',
						'Values for levels cannot be smaller than the previous level',
						value => {
							if (!value) {
								return false;
							}

							for (let i = 0; i < value.length - 1; ++i) {
								if (
									(value[i]?.count ?? 0) > (value[i + 1]?.count ?? 0) ||
									(value[i]?.die ?? 0) > (value[i + 1]?.die ?? 0) ||
									(!((value[i]?.count ?? 0) > 0 && (value[i].die ?? 0) > 0) &&
										((value[i]?.count ?? 0) > 0 || (value[i].die ?? 0) > 0))
								) {
									return false;
								}
							}

							return true;
						}
					)
			})
		)
		.optional()
		.default(undefined),
	perLevelBonuses: array()
		.of(
			object({
				name: string()
					.required('Name is required')
					.min(1, 'Name is required')
					.max(50, 'Name cannot be longer than 50 characters'),
				levels: array()
					.of(number().min(1, 'Bonus must be at least 1').nullable())
					.length(20, 'Must have bonus for each level')
					.test(
						'is-ascending',
						'Values for levels cannot be smaller than the previous level',
						value => {
							if (!value) {
								return false;
							}

							for (let i = 0; i < value.length - 1; ++i) {
								if ((value[i] ?? 0) > (value[i + 1] ?? 0)) {
									return false;
								}
							}

							return true;
						}
					)
			})
		)
		.optional()
		.default(undefined),
	perLevelDistances: array()
		.of(
			object({
				name: string()
					.required('Name is required')
					.min(1, 'Name is required')
					.max(50, 'Name cannot be longer than 50 characters'),
				levels: array()
					.of(number().min(1, 'Distance must be at least 1').nullable())
					.length(20, 'Must have distance for each level')
					.test(
						'is-ascending',
						'Values for levels cannot be smaller than the previous level',
						value => {
							if (!value) {
								return false;
							}

							for (let i = 0; i < value.length - 1; ++i) {
								if ((value[i] ?? 0) > (value[i + 1] ?? 0)) {
									return false;
								}
							}

							return true;
						}
					)
			})
		)
		.optional()
		.default(undefined),
	subFeatureOptions: object({
		choiceType: string()
			.required('Choice type is required')
			.oneOf(
				['once', 'per-level'],
				'Choice type must be either "once" or "per-level"'
			),
		choose: number()
			.min(1, 'Cannot choose less than 1 option')
			.when('choiceType', {
				is: 'once',
				then: schema => schema.required('Choose is required'),
				otherwise: schema => schema.optional().default(undefined)
			})
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
								options?: any[];
							};
						}
					>context;

					return value < (options?.length ?? 0);
				}
			),
		perLevelNumberIndex: number()
			.min(0, 'Per level number index cannot be less than 0')
			.when('choiceType', {
				is: 'per-level',
				then: schema => schema.required('Per level number index is required'),
				otherwise: schema => schema.optional().default(undefined)
			}),
		options: array()
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
					prerequisites: array()
						.of(
							object({
								type: string()
									.oneOf(['level', 'feature', 'spell'])
									.required('Type is required'),
								level: number()
									.min(1, 'Level cannot be lower than 1')
									.max(20, 'Level cannot be greater than 20')
									.when('type', {
										is: 'level',
										then: schema => schema.required('Level is required'),
										otherwise: schema => schema.optional().default(undefined)
									}),
								feature: getItemSchema('Feature').when('type', {
									is: 'feature',
									then: schema => schema.required('Feature is requred'),
									otherwise: schema => schema.optional().default(undefined)
								}),
								spell: getItemSchema('Spell').when('type', {
									is: 'spell',
									then: schema => schema.required('Spell is required'),
									otherwise: schema => schema.optional().default(undefined)
								})
							})
						)
						.min(1, 'Must have at least 1 prerequisite')
						.max(3, 'Cannot have more than 3 prerequisites')
						.optional()
						.default(undefined)
				})
			)
			.required('Options are required')
			.min(1, 'At least 1 option is required')
			.max(20, 'Cannot have more than 20 options')
	})
		.test(
			'valid-per-level-number-index',
			'Per level number index must be lower than per level numbers length',
			(value, context) => {
				if (!value) {
					return false;
				}

				const {
					parent: { perLevelNumbers }
				} = <
					{
						parent: {
							perLevelNumbers?: any[];
						};
					}
				>context;

				return (
					(value.perLevelNumberIndex ?? 0) < (perLevelNumbers?.length ?? 0)
				);
			}
		)
		.optional()
		.default(undefined)
});

export default featureSchema;
