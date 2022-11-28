import UsernameReminderView from '../../../../src/views/UsernameReminder/UsernameReminder';
import { getSession } from '../../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const UsernameReminderPage = async ({
	params: { otlId }
}: {
	params: { otlId: string };
}) => {
	const session = await getSession();

	if (session?.user) {
		redirect('/');
	}

	return <UsernameReminderView otlId={otlId} />;
};

export default UsernameReminderPage;
