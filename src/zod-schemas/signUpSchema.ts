import { z } from 'zod';

import { hasValidUsername } from './../services/usernameValidatorService';
import passwordSchema from './passwordSchema';

export default z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.trim()
		.nonempty('Username is required')
		.refine(
			hasValidUsername,
			'Username must begin with a letter and contain only letters and numbers.'
		),
	email: z
		.string()
		.email('Enter your email in the format: yourname@example.com')
		.optional(),
	password: passwordSchema
});
