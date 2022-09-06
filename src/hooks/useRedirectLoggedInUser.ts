import { useAppSelector } from './reduxHooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useRedirectLoggedInUser = () => {
	const router = useRouter();
	const viewer = useAppSelector(state => state.viewer);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (viewer) {
			router.replace('/');
		} else {
			setLoading(false);
		}
	}, [router, viewer]);

	return { loading };
};

export default useRedirectLoggedInUser;
