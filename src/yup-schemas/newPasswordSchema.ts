import {
	hasLowerCase,
	hasNumber,
	hasSpecialCharacter,
	hasUpperCase
} from '../services/passwordValidatorService';
import { object, ref, string } from 'yup';

const newPasswordSchema = object({
	currentPassword: string().required('Current password is required'),
	newPassword: string()
		.min(8, 'Password must be at least 8 characters long')
		.required('Password is required')
		.test(
			'contains-lowercase',
			'Password must have at least 1 lowercase character',
			function (value) {
				return !!value && hasLowerCase(value);
			}
		)
		.test(
			'contains-uppercase',
			'Password must have at least 1 uppercase character',
			function (value) {
				return !!value && hasUpperCase(value);
			}
		)
		.test(
			'contains-number',
			'Password must have at least 1 number',
			function (value) {
				return !!value && hasNumber(value);
			}
		)
		.test(
			'contains-special-character',
			'Password must contain one of the following characters:  !"#$%&\'()*+,-./:;<=>?@[\\]^_`{}|~',
			function (value) {
				return !!value && hasSpecialCharacter(value);
			}
		),
	confirmPassword: string()
		.required('Password confirmation is required')
		.oneOf([ref('newPassword'), null], 'Passwords do not match')
});

export default newPasswordSchema;
