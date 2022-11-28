'use client';

import LogInSignUpForm, {
	LogInSignUpValues
} from '../../../components/LogInSignUp/LogInSignUpForm';

import { FormikHelpers } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import logInSchema from '../../../yup-schemas/logInSchema';
import { show } from '../../../redux/features/toast';
import { signIn } from 'next-auth/react';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback } from 'react';

const LogIn = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const handleSubmit = useCallback(
		async (
			values: LogInSignUpValues,
			{ resetForm }: FormikHelpers<LogInSignUpValues>
		) => {
			const { username, password } = values;

			const result = await signIn('credentials', {
				callbackUrl: '/',
				username,
				password
			});
			if (result?.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error,
					type: ToastType.error
				};
				dispatch(show(toast));
			}

			resetForm();
		},
		[dispatch]
	);

	return (
		<MainContent>
			<h1>Log In</h1>
			<LogInSignUpForm
				schema={logInSchema}
				type="logIn"
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default LogIn;
