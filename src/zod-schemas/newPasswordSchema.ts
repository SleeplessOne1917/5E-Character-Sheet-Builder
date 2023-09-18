import resetPasswordSchema from './resetPasswordSchema';
import { z } from 'zod';

export default z.intersection(
	resetPasswordSchema,
	z.object({
		currentPassword: z.string({
			required_error: 'Current password is required'
		})
	})
);
