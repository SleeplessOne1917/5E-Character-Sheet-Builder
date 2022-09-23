import { object, ref, string } from 'yup';
import passwordSchema from './passwordSchema';

const resetPasswordSchema = object({
	password: passwordSchema,
	confirmPassword: string()
		.required('Password confirmation is required')
		.oneOf([ref('password'), null], 'Passwords do not match')
});

export default resetPasswordSchema;
