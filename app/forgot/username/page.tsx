import ForgotUsernameView from '../../../src/views/forgot/ForgotUsername/ForgotUsername';
import { getViewer } from '../../../src/graphql/characterSheetBuilderClientService';

const ForgotUsernamePage = async () => {
	const username = await getViewer();

	return <ForgotUsernameView username={username} />;
};

export default ForgotUsernamePage;
