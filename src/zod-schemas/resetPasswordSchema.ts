import passwordSchema from './passwordSchema';
import { z } from 'zod';

export default z
	.object({
		currentPassword: z.string({
			required_error: 'Current password is required'
		}),
		newPassword: passwordSchema,
		confirmPassword: z.string({
			required_error: 'Password confirmation is required'
		})
	})
	.refine(
		({ newPassword, confirmPassword }) => newPassword === confirmPassword,
		{ message: 'Passwords do not match', path: ['confirmPassword'] }
	);
