import { number, object, string } from 'yup';

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
		.max(20, 'Level cannot be more than 20')
});

export default featureSchema;
