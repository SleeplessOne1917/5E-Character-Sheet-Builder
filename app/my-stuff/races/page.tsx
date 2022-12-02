import MyStuffRacesView from '../../../src/views/MyStuff/races/MyStuffRaces';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const MyStuffRacesPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <MyStuffRacesView />;
};

export default MyStuffRacesPage;
