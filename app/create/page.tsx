import CreateIndexView from '../../src/views/create/index/CreateIndex';
import { getViewer } from '../../src/graphql/characterSheetBuilderClientService';

const CreatePage = async () => {
	const username = await getViewer();

	return <CreateIndexView username={username} />;
};

export default CreatePage;
