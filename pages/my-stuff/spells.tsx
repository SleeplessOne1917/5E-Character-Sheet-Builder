import MyStuffSpellsView from '../../src/views/MyStuff/spells/MyStuffSpells';
import { NextPage } from 'next';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';

const MyStuffSpellsPage: NextPage = () => {
	const { loading } = useRedirectLoggedOffUser();

	return <MyStuffSpellsView loading={loading} />;
};

export default MyStuffSpellsPage;
