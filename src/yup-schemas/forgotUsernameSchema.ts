import { object, string } from 'yup';

const forgotUsernameSchema = object({
	email: string()
		.required('Email is required')
		.email('Enter your email in the format: yourname@example.com')
});

export default forgotUsernameSchema;
