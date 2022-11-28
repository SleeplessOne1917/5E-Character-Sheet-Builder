import ResetPasswordView from '../../../../src/views/ResetPassword/ResetPassword';
import { getSession } from '../../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const ResetPasswordPage = async ({
	params: { otlId }
}: {
	params: { otlId: string };
}) => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <ResetPasswordView otlId={otlId} />;
};

export default ResetPasswordPage;
