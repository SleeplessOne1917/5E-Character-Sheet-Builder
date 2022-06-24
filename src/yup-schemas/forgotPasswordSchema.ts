import { object, string } from 'yup';

const forgotPasswordSchema = object({
	email: string()
		.required('Email is required')
		.email('Enter your email in the format: yourname@example.com'),
	username: string().required('Username is required')
});

export default forgotPasswordSchema;
