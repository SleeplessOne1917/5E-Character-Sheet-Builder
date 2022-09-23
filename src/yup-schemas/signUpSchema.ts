import { object, string } from 'yup';

import { hasValidUsername } from './../services/usernameValidatorService';
import passwordSchema from './passwordSchema';

const signUpSchema = object({
	username: string()
		.required('Username is required')
		.test(
			'is-valid-username',
			'Username must begin with a letter and contain only letters and numbers.',
			value => !!value && hasValidUsername(value)
		),
	email: string().email('Enter your email in the format: yourname@example.com'),
	password: passwordSchema
});

export default signUpSchema;
