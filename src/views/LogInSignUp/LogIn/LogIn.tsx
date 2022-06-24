import LOG_IN from '../../../graphql/mutations/user/logIn';
import LogInSignUpForm from '../../../components/LogInSignUp/LogInSignUpForm';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import classes from '../LogInSignUp.module.css';
import { fetchLoggedInEmail } from '../../../redux/features/viewer';
import logInSchema from '../../../yup-schemas/logInSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const LogIn = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [logInResult, logIn] = useMutation(LOG_IN);
	const router = useRouter();

	return (
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
						await dispatch(fetchLoggedInEmail());
						router.replace('/');
					}
					resetForm();
				}}
			/>
		</MainContent>
	);
};

export default LogIn;
