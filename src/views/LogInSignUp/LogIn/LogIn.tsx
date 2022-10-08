import {
	accessTokenKey,
	refreshTokenKey
} from '../../../constants/generalConstants';

import { AuthResponse } from '../../../types/auth';
import LOG_IN from '../../../graphql/mutations/user/logIn';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import LogInSignUpForm from '../../../components/LogInSignUp/LogInSignUpForm';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import { fetchLoggedInUsername } from '../../../redux/features/viewer';
import logInSchema from '../../../yup-schemas/logInSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

type LogInProps = {
	loading: boolean;
};

const LogIn = ({ loading }: LogInProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [_, logIn] = useMutation<{ logIn: AuthResponse }>(LOG_IN);
	const router = useRouter();

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent>
					<h1>Log In</h1>
					<LogInSignUpForm
						schema={logInSchema}
						type="logIn"
						onSubmit={async (values, { resetForm }) => {
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
								const { accessToken, refreshToken } = result.data
									?.logIn as AuthResponse;

								localStorage.setItem(accessTokenKey, accessToken);
								localStorage.setItem(refreshTokenKey, refreshToken);

								await dispatch(fetchLoggedInUsername());
								router.replace('/');
							}
							resetForm();
						}}
					/>
				</MainContent>
			)}
		</>
	);
};

export default LogIn;
