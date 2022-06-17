import {
	hasLowerCase,
	hasNumber,
	hasSpecialCharacter,
	hasUpperCase
} from './../services/passwordValidatorService';
import { object, string } from 'yup';

import { hasValidUsername } from './../services/usernameValidatorService';

const signUpSchema = object({
	username: string()
		.required('Username is required')
		.test(
			'is-valid-username',
			'Username must begin with a letter and contain only letters and numbers.',
			function (value) {
				return !!value && hasValidUsername(value);
			}
		),
	email: string().email('Enter your email in the format: yourname@example.com'),
	password: string()
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
		)
});

export default signUpSchema;
