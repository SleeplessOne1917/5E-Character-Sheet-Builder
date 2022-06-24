import { NextPage } from 'next';
import ResetPasswordView from '../../../src/views/ResetPassword/ResetPassword';
import { useRouter } from 'next/router';

const ResetPasswordPage: NextPage = () => {
	const router = useRouter();
	const { otlId } = router.query;

	return <ResetPasswordView otlId={(otlId || '') as string} />;
};

export default ResetPasswordPage;
