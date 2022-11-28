import MyStuffSpellsView from '../../../src/views/MyStuff/spells/MyStuffSpells';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const MyStuffSpellsPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <MyStuffSpellsView />;
};

export default MyStuffSpellsPage;
