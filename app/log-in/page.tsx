import LogInView from '../../src/views/LogInSignUp/LogIn/LogIn';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const LogInPage = async () => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <LogInView />;
};

export default LogInPage;
