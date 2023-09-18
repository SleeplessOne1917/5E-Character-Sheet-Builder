import { z } from 'zod';

export default (field: string) =>
	z.object(
		{
			id: z
				.string({ required_error: 'Id is required' })
				.trim()
				.nonempty('Id is required')
				.max(50, 'Id cannot be longer than 50 characters'),
			name: z
				.string({ required_error: 'Name is required' })
				.trim()
				.nonempty('Name is required')
				.max(50, 'Name cannot be longer than 50 characters')
		},
		{ required_error: `${field} is required` }
	);
