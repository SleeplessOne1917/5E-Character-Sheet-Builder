'use client';

import LogInSignUpForm, {
	LogInSignUpValues
} from '../../../components/LogInSignUp/LogInSignUpForm';
import { ToastShowPayload, show } from '../../../redux/features/toast';

import { FormikHelpers } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { trpc } from '../../../common/trpcNext';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const signUpMutation = trpc.signUp.useMutation();

	const handleSubmit = useCallback(
		async (
			values: LogInSignUpValues,
			{ resetForm }: FormikHelpers<LogInSignUpValues>
		) => {
			const { email, password, username } = values;
			let toast: ToastShowPayload;
			const closeTimeoutSeconds = 10;

			try {
				await signUpMutation.mutateAsync({
					email,
					password,
					username
				});

				toast = {
					closeTimeoutSeconds,
					message: 'Successfully signed up! Logging you in now...',
					type: ToastType.success
				};
				dispatch(show(toast));
				router.push('/log-in');
			} catch (e) {
				toast = {
					closeTimeoutSeconds,
					message: (e as Error).message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} finally {
				resetForm();
			}
		},
		[router, dispatch, signUpMutation]
	);

	return (
		<MainContent>
			<h1>Sign Up</h1>
			<LogInSignUpForm
				schema={signUpSchema}
				type="signUp"
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default SignUp;
