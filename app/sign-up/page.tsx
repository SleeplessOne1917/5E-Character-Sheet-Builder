import SignUpView from '../../src/views/LogInSignUp/SignUp/SignUp';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const SignUpPage = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <SignUpView />;
};

export default SignUpPage;
