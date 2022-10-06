import { NextPage } from 'next';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import MyStuffIndexView from '../../src/views/MyStuff/index/MyStuffIndex';

const MyStuffIndexPage: NextPage = () => {
	const { loading } = useRedirectLoggedOffUser();

	return <MyStuffIndexView loading={loading} />;
};

export default MyStuffIndexPage;
