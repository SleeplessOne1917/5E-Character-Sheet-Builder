import { ToastShowPayload, show } from '../../../redux/features/toast';
import {
	accessTokenKey,
	refreshTokenKey
} from '../../../constants/generalConstants';

import { AuthResponse } from '../../../types/auth';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import LogInSignUpForm from '../../../components/LogInSignUp/LogInSignUpForm';
import MainContent from '../../../components/MainContent/MainContent';
import SIGN_UP from '../../../graphql/mutations/user/signUp';
import { ToastType } from '../../../types/toast';
import { fetchLoggedInUsername } from '../../../redux/features/viewer';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

type SignUpProps = {
	loading: boolean;
};

const SignUp = ({ loading }: SignUpProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [_, signUp] = useMutation<{ signUp: AuthResponse }>(SIGN_UP);
	const router = useRouter();

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent>
					<h1>Sign Up</h1>
					<LogInSignUpForm
						schema={signUpSchema}
						type="signUp"
						onSubmit={async (values, { resetForm }) => {
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
								const { accessToken, refreshToken } = result.data
									?.signUp as AuthResponse;

								localStorage.setItem(accessTokenKey, accessToken);
								localStorage.setItem(refreshTokenKey, refreshToken);

								toast = {
									closeTimeoutSeconds,
									message: 'Successfully signed up! Logging you in now...',
									type: ToastType.success
								};
								await dispatch(fetchLoggedInUsername());
								dispatch(show(toast));
								resetForm();
								router.replace('/');
							}
						}}
					/>
				</MainContent>
			)}
		</>
	);
};

export default SignUp;
