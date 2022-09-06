import { NextPage } from 'next';
import ResetPasswordView from '../../../src/views/ResetPassword/ResetPassword';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';
import { useRouter } from 'next/router';

const ResetPasswordPage: NextPage = () => {
	const router = useRouter();
	const { otlId } = router.query;
	const { loading } = useRedirectLoggedInUser();

	return (
		<ResetPasswordView
			otlId={(otlId || '') as string}
			loggedInLoading={loading}
		/>
	);
};

export default ResetPasswordPage;
