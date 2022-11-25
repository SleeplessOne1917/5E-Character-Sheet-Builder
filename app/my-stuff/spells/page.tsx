import MyStuffSpellsView from '../../../src/views/MyStuff/spells/MyStuffSpells';
import { getViewer } from '../../../src/graphql/characterSheetBuilderClientService';

const MyStuffSpellsPage = async () => {
	const username = await getViewer();

	return <MyStuffSpellsView username={username} />;
};

export default MyStuffSpellsPage;
