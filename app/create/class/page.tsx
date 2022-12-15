import ClassView from '../../../src/views/create/class/Class';
import { getSession } from '../../../src/services/sessionService';
import { redirect } from 'next/navigation';

const ClassPage = async () => {
	const session = await getSession();

	if (!session?.user) {
		redirect('/');
	}

	return <ClassView />;
};

export default ClassPage;
