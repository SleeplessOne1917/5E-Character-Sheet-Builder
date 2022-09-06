import { NextPage } from 'next';
import SignUpView from '../src/views/LogInSignUp/SignUp/SignUp';
import useRedirectLoggedInUser from '../src/hooks/useRedirectLoggedInUser';

const SignUpPage: NextPage = () => {
	const { loading } = useRedirectLoggedInUser();

	return <SignUpView loading={loading} />;
};

export default SignUpPage;
