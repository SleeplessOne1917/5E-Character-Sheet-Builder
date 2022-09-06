import ForgotPasswordView from '../../../src/views/forgot/ForgotPassword/ForgotPassword';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';

const ForgotPasswordPage: NextPage = () => {
	const { loading } = useRedirectLoggedInUser();

	return <ForgotPasswordView loading={loading} />;
};

export default ForgotPasswordPage;
