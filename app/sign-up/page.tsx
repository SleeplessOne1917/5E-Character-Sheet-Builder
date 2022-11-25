import SignUpView from '../../src/views/LogInSignUp/SignUp/SignUp';
import { getViewer } from '../../src/graphql/characterSheetBuilderClientService';

const SignUpPage = async () => {
	const username = await getViewer();

	return <SignUpView username={username} />;
};

export default SignUpPage;
