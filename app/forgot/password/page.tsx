import ForgotPasswordView from '../../../src/views/forgot/ForgotPassword/ForgotPassword';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const ForgotPasswordPage = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <ForgotPasswordView />;
};

export default ForgotPasswordPage;
