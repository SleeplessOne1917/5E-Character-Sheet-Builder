import { string } from 'yup';
import {
	hasLowerCase,
	hasNumber,
	hasSpecialCharacter,
	hasUpperCase
} from '../services/passwordValidatorService';

const passwordSchema = string()
	.min(8, 'Password must be at least 8 characters long')
	.required('Password is required')
	.test(
		'contains-lowercase',
		'Password must have at least 1 lowercase character',
		value => !!value && hasLowerCase(value)
	)
	.test(
		'contains-uppercase',
		'Password must have at least 1 uppercase character',
		value => !!value && hasUpperCase(value)
	)
	.test(
		'contains-number',
		'Password must have at least 1 number',
		value => !!value && hasNumber(value)
	)
	.test(
		'contains-special-character',
		'Password must contain one of the following characters:  !"#$%&\'()*+,-./:;<=>?@[\\]^_`{}|~',
		value => !!value && hasSpecialCharacter(value)
	);

export default passwordSchema;
