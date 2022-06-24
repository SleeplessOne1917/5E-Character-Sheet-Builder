import LogInView from '../src/views/LogInSignUp/LogIn/LogIn';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../src/hooks/useRedirectLoggedInUser';

const LogInPage: NextPage = () => {
	useRedirectLoggedInUser();

	return <LogInView />;
};

export default LogInPage;
