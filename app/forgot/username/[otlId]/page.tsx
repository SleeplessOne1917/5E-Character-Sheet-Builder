import UsernameReminderView from '../../../../src/views/UsernameReminder/UsernameReminder';
import { getViewer } from '../../../../src/graphql/characterSheetBuilderClientService';

const UsernameReminderPage = async ({
	params: { otlId }
}: {
	params: { otlId: string };
}) => {
	const username = await getViewer();

	return <UsernameReminderView otlId={otlId} username={username} />;
};

export default UsernameReminderPage;
