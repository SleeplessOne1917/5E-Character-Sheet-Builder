import ForgotUsernameView from '../../../src/views/forgot/ForgotUsername/ForgotUsername';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const ForgotUsernamePage = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <ForgotUsernameView />;
};

export default ForgotUsernamePage;
