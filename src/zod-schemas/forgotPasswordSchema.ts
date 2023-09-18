import { z } from 'zod';
import forgotUsernameSchema from './forgotUsernameSchema';

export default forgotUsernameSchema.extend({
	username: z.string({ required_error: 'Username is required' })
});
