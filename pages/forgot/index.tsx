import ForgotIndexView from '../../src/views/forgot/ForgotIndex/ForgotIndex';
import { NextPage } from 'next';
import useRedirectLoggedInUser from '../../src/hooks/useRedirectLoggedInUser';

const ForgotIndexPage: NextPage = () => {
	const { loading } = useRedirectLoggedInUser();

	return <ForgotIndexView loading={loading} />;
};

export default ForgotIndexPage;
