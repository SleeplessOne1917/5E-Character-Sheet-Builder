import ForgotUsernameView from '../../../src/views/forgot/ForgotUsername/ForgotUsername';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';

const ForgotUsernamePage: NextPage = () => {
	const { loading } = useRedirectLoggedInUser();

	return <ForgotUsernameView loading={loading} />;
};

export default ForgotUsernamePage;
