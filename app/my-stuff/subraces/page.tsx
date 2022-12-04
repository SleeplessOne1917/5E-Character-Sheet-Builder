import MyStuffSubracesView from '../../../src/views/MyStuff/subraces/MyStuffSubraces';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const MyStuffSubracesPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <MyStuffSubracesView />;
};

export default MyStuffSubracesPage;
