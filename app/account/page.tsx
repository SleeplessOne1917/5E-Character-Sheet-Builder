import AccountView from '../../src/views/Account/Account';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const AccountPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <AccountView username={session.user.name ?? undefined} />;
};

export default AccountPage;
