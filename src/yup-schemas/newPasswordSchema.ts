import { object, ref, string } from 'yup';
import passwordSchema from './passwordSchema';

const newPasswordSchema = object({
	currentPassword: string().required('Current password is required'),
	newPassword: passwordSchema,
	confirmPassword: string()
		.required('Password confirmation is required')
		.oneOf([ref('newPassword'), null], 'Passwords do not match')
});

export default newPasswordSchema;
