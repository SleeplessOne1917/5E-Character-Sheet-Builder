import LogInView from '../src/views/LogInSignUp/LogIn/LogIn';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../src/hooks/useRedirectLoggedInUser';

const LogInPage: NextPage = () => {
	const { loading } = useRedirectLoggedInUser();

	return <LogInView loading={loading} />;
};

export default LogInPage;
