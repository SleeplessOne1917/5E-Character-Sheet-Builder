import { useAppSelector } from './reduxHooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useRedirectLoggedInUser = () => {
	const router = useRouter();
	const viewer = useAppSelector(state => state.viewer);

	useEffect(() => {
		if (viewer) {
			router.replace('/');
		}
	}, [router, viewer]);
};

export default useRedirectLoggedInUser;
