import { object, string } from 'yup';

const forgotUsernameSchema = object({
	email: string().required('Email is required')
});

export default forgotUsernameSchema;
