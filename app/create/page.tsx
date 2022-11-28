import CreateIndexView from '../../src/views/create/index/CreateIndex';
import { getSession } from '../../src/services/sessionService';

const CreatePage = async () => {
	const session = await getSession();

	return <CreateIndexView username={session?.user?.name ?? undefined} />;
};

export default CreatePage;
