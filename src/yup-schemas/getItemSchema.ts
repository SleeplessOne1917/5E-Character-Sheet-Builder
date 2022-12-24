import { object, string } from 'yup';

const getItemSchema = (label: string) =>
	object({
		id: string()
			.required()
			.max(50, `${label} id cannot be more than 50 characters long`),
		name: string()
			.required()
			.max(50, `${label} name cannot be more than 50 characters long`)
	});

export default getItemSchema;
