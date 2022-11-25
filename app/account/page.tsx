import AccountView from '../../src/views/Account/Account';
import { getViewer } from '../../src/graphql/characterSheetBuilderClientService';

const AccountPage = async () => {
	const username = await getViewer();

	return <AccountView username={username} />;
};

export default AccountPage;
