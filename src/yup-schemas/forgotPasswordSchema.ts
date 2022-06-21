import { object, string } from 'yup';

const forgotPasswordSchema = object({
	email: string().required('Email is required'),
	username: string().required('Username is required')
});

export default forgotPasswordSchema;
