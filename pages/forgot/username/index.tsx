import ForgotUsernameView from '../../../src/views/forgot/ForgotUsername/ForgotUsername';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';

const ForgotUsernamePage: NextPage = () => {
	useRedirectLoggedInUser();

	return <ForgotUsernameView />;
};

export default ForgotUsernamePage;
