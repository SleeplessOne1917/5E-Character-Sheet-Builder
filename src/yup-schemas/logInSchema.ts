import { object, string } from 'yup';

const logInSchema = object({
	email: string()
		.email('Enter your email in the format: yourname@example.com')
		.required('Email is required'),
	password: string().required('Password is required')
});

export default logInSchema;
