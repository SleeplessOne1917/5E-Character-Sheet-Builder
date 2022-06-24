import { NextPage } from 'next';
import SignUpView from '../src/views/LogInSignUp/SignUp/SignUp';
import useRedirectLoggedInUser from '../src/hooks/useRedirectLoggedInUser';

const SignUpPage: NextPage = () => {
	useRedirectLoggedInUser();

	return <SignUpView />;
};

export default SignUpPage;
