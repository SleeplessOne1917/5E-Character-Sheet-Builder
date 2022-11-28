import { isObjectId } from '../services/objectIdService';
import { string } from 'yup';

const otlIdSchema = string()
	.required('OTL ID must be defined')
	.test('is-objectID', 'Invalid format', value => !!value && isObjectId(value));

export default otlIdSchema;
