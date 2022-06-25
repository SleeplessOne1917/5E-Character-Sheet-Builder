import AccountView from '../src/views/Account/Account';
import { NextPage } from 'next';
import useRedirectLoggedOffUser from '../src/hooks/useRedirectLoggedOffUser';

const AccountPage: NextPage = () => {
	useRedirectLoggedOffUser();

	return <AccountView />;
};

export default AccountPage;
