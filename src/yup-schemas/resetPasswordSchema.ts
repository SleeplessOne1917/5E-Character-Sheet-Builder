import { object, ref, string } from 'yup';

import otlIdSchema from './otlIdSchema';
import passwordSchema from './passwordSchema';

const resetPasswordSchema = object({
	password: passwordSchema,
	confirmPassword: string()
		.required('Password confirmation is required')
		.oneOf([ref('password'), null], 'Passwords do not match'),
	otlId: otlIdSchema
});

export default resetPasswordSchema;
