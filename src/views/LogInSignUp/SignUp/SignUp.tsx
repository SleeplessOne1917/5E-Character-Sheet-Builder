import { ToastShowPayload, show } from '../../../redux/features/toast';

import LogInSignUpForm from '../../../components/LogInSignUp/LogInSignUpForm';
import MainContent from '../../../components/MainContent/MainContent';
import SIGN_UP from '../../../graphql/mutations/user/signUp';
import { ToastType } from '../../../types/toast';
import classes from '../LogInSignUp.module.css';
import { fetchLoggedInEmail } from '../../../redux/features/viewer';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const SignUp = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [signUpResult, signUp] = useMutation(SIGN_UP);
	const router = useRouter();

	return (
		<MainContent>
			<h1>Sign Up</h1>
			<LogInSignUpForm
				schema={signUpSchema}
				type="signUp"
				onSubmit={async (values, { resetForm }) => {
					const { email, password, username } = values;
					const result = await signUp({ user: { email, password, username } });
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
						await dispatch(fetchLoggedInEmail());
						dispatch(show(toast));
						resetForm();
						router.replace('/');
					}
				}}
			/>
		</MainContent>
	);
};

export default SignUp;
