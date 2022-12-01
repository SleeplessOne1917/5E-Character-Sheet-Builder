import MyStuffIndexView from '../../src/views/MyStuff/index/MyStuffIndex';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const MyStuffIndexPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <MyStuffIndexView />;
};

export default MyStuffIndexPage;
