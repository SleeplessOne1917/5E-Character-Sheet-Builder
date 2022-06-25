import CreateIndexView from '../../src/views/create/index/CreateIndex';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CreatePage: NextPage = () => {
	const { replace } = useRouter();
	useEffect(() => {
		replace('/create/race');
	}, [replace]);

	return <CreateIndexView />;
};

export default CreatePage;
