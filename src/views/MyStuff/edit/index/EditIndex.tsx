import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const EditIndex = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace('/my-stuff');
	});

	return <LoadingPageContent />;
};

export default EditIndex;
