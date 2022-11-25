import ForgotIndexView from '../../src/views/forgot/ForgotIndex/ForgotIndex';
import { getViewer } from '../../src/graphql/characterSheetBuilderClientService';

const ForgotIndexPage = async () => {
	const username = await getViewer();

	return <ForgotIndexView username={username} />;
};

export default ForgotIndexPage;
