import { isObjectId } from '../services/objectIdService';
import { string } from 'yup';

const idSchema = string()
	.required('ID is required')
	.test(
		'is-objectId',
		'ID must be 24 character long hex string',
		val => !!val && isObjectId(val)
	);

export default idSchema;
