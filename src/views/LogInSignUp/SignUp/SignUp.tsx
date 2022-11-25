'use client';

import LogInSignUpForm, {
	LogInSignUpValues
} from '../../../components/LogInSignUp/LogInSignUpForm';
import { ToastShowPayload, show } from '../../../redux/features/toast';
import { useCallback, useEffect } from 'react';

import { FormikHelpers } from 'formik';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SIGN_UP from '../../../graphql/mutations/user/signUp';
import { ToastType } from '../../../types/toast';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type SignUpProps = {
	username?: string;
};

const SignUp = ({ username }: SignUpProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [_, signUp] = useMutation(SIGN_UP);
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
		<>
			{username && <LoadingPageContent />}
			{!username && (
				<MainContent>
					<h1>Sign Up</h1>
					<LogInSignUpForm
						schema={signUpSchema}
						type="signUp"
						onSubmit={handleSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default SignUp;
