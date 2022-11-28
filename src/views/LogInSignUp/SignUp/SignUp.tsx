'use client';

import LogInSignUpForm, {
	LogInSignUpValues
} from '../../../components/LogInSignUp/LogInSignUpForm';
import { ToastShowPayload, show } from '../../../redux/features/toast';

import { FormikHelpers } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import SIGN_UP from '../../../graphql/mutations/user/signUp';
import { ToastType } from '../../../types/toast';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

const SignUp = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [_, signUp] = useMutation(SIGN_UP);
	const router = useRouter();

	const handleSubmit = useCallback(
		async (
			values: LogInSignUpValues,
			{ resetForm }: FormikHelpers<LogInSignUpValues>
		) => {
			const { email, password, username } = values;
			const result = await signUp({
				user: { email, password, username }
			});
			let toast: ToastShowPayload;
			const closeTimeoutSeconds = 10;

			if (result.error) {
				toast = {
					closeTimeoutSeconds,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
				resetForm();
			} else {
				toast = {
					closeTimeoutSeconds,
					message: 'Successfully signed up! Logging you in now...',
					type: ToastType.success
				};
				dispatch(show(toast));
				resetForm();
				router.replace('/');
			}
		},
		[router, dispatch, signUp]
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
