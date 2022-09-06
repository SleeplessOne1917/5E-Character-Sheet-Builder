import AccountView from '../src/views/Account/Account';
import { NextPage } from 'next';
import useRedirectLoggedOffUser from '../src/hooks/useRedirectLoggedOffUser';

const AccountPage: NextPage = () => {
	const { loading } = useRedirectLoggedOffUser();

	return <AccountView loading={loading} />;
};

export default AccountPage;
