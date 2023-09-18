import {
	hasLowerCase,
	hasNumber,
	hasSpecialCharacter,
	hasUpperCase
} from '../services/passwordValidatorService';
import { z } from 'zod';

export default z
	.string({ required_error: 'Password is required' })
	.min(8, 'Password must be at least 8 characters long')
	.refine(hasLowerCase, 'Password must have at least 1 lowercase character')
	.refine(hasUpperCase, 'Password must have at least 1 uppercase character')
	.refine(hasNumber, 'Password must have at least 1 number')
	.refine(
		hasSpecialCharacter,
		'Password must contain one of the following characters:  !"#$%&\'()*+,-./:;<=>?@[\\]^_`{}|~'
	);
