import ForgotPasswordView from '../../../src/views/forgot/ForgotPassword/ForgotPassword';
import { getViewer } from '../../../src/graphql/characterSheetBuilderClientService';

const ForgotPasswordPage = async () => {
	const username = await getViewer();

	return <ForgotPasswordView username={username} />;
};

export default ForgotPasswordPage;
