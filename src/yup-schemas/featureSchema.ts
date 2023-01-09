import { array, number, object, string } from 'yup';

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
		.default(undefined)
});

export default featureSchema;
