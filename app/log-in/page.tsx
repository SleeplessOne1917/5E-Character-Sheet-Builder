import LogInView from '../../src/views/LogInSignUp/LogIn/LogIn';
import { getViewer } from '../../src/graphql/characterSheetBuilderClientService';

const LogInPage = async () => {
	const username = await getViewer();

	return <LogInView username={username} />;
};

export default LogInPage;
