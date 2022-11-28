import ForgotIndexView from '../../src/views/forgot/ForgotIndex/ForgotIndex';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const ForgotIndexPage = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <ForgotIndexView />;
};

export default ForgotIndexPage;
