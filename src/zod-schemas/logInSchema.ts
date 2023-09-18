import { z } from 'zod';

export default z.object({
	username: z.string({ required_error: 'Username is required' }),
	password: z.string({ required_error: 'Password is required' })
});
