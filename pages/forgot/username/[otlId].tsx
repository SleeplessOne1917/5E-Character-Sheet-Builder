import { NextPage } from 'next';
import UsernameReminderView from '../../../src/views/UsernameReminder/UsernameReminder';
import { useRouter } from 'next/router';

const UsernameReminderPage: NextPage = () => {
	const router = useRouter();
	const { otlId } = router.query;

	return <UsernameReminderView otlId={(otlId || '') as string} />;
};

export default UsernameReminderPage;
