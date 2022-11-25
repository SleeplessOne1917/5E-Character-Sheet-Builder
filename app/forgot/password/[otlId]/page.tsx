import ResetPasswordView from '../../../../src/views/ResetPassword/ResetPassword';
import { getViewer } from '../../../../src/graphql/characterSheetBuilderClientService';

const ResetPasswordPage = async ({
	params: { otlId }
}: {
	params: { otlId: string };
}) => {
	const username = await getViewer();

	return <ResetPasswordView otlId={otlId} username={username} />;
};

export default ResetPasswordPage;
