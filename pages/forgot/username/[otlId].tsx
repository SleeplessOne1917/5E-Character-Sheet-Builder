import { NextPage } from 'next';
import UsernameReminderView from '../../../src/views/UsernameReminder/UsernameReminder';
import useRedirectLoggedInUser from '../../../src/hooks/useRedirectLoggedInUser';
import { useRouter } from 'next/router';

const UsernameReminderPage: NextPage = () => {
	const router = useRouter();
	const { otlId } = router.query;
	const { loading } = useRedirectLoggedInUser();

	return (
		<UsernameReminderView
			otlId={(otlId || '') as string}
			loggedInLoading={loading}
		/>
	);
};

export default UsernameReminderPage;
