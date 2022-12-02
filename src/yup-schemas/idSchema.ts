import { string } from 'yup';

const idSchema = string().required('ID is required');

export default idSchema;
