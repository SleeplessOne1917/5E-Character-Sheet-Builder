import MyStuffIndexView from '../../src/views/MyStuff/index/MyStuffIndex';
import { getLimitedSpells } from '../../src/graphql/characterSheetBuilderClientService';
import { getSession } from '../../src/services/sessionService';
import { redirect } from 'next/navigation';

const MyStuffIndexPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	const spells = (await getLimitedSpells(5)).data?.spells ?? [];

	return <MyStuffIndexView spells={spells} />;
};

export default MyStuffIndexPage;
