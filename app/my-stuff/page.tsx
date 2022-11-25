import {
	getLimitedSpells,
	getViewer
} from '../../src/graphql/characterSheetBuilderClientService';

import MyStuffIndexView from '../../src/views/MyStuff/index/MyStuffIndex';

const MyStuffIndexPage = async () => {
	const username = await getViewer();

	const spells = (await getLimitedSpells(5)).data?.spells ?? [];

	return <MyStuffIndexView username={username} spells={spells} />;
};

export default MyStuffIndexPage;
