'use client';

import LogInSignUpForm, {
	LogInSignUpValues
} from '../../../components/LogInSignUp/LogInSignUpForm';
import { useCallback, useEffect } from 'react';

import { FormikHelpers } from 'formik';
import LOG_IN from '../../../graphql/mutations/user/logIn';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import logInSchema from '../../../yup-schemas/logInSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type LogInProps = {
	username?: string;
};

const LogIn = ({ username }: LogInProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [_, logIn] = useMutation(LOG_IN);
	const router = useRouter();

	useEffect(() => {
		if (username) {
			router.replace('/');
		}
	}, [username, router]);

	const handleSubmit = useCallback(
		async (
			values: LogInSignUpValues,
			{ resetForm }: FormikHelpers<LogInSignUpValues>
		) => {
			const { username, password } = values;
			const result = await logIn({ user: { username, password } });
			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				router.replace('/');
			}
			resetForm();
		},
		[dispatch, router, logIn]
	);

	return (
		<>
			{username && <LoadingPageContent />}
			{!username && (
				<MainContent>
					<h1>Log In</h1>
					<LogInSignUpForm
						schema={logInSchema}
						type="logIn"
						onSubmit={handleSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default LogIn;
