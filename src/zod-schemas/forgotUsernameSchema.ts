import { z } from 'zod';

export default z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email('Enter your email in the format: yourname@example.com')
});
