import ForgotPasswordView from '../../../src/views/forgot/ForgotPassword/ForgotPassword';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';

const ForgotPasswordPage: NextPage = () => {
	useRedirectLoggedInUser();

	return <ForgotPasswordView />;
};

export default ForgotPasswordPage;
