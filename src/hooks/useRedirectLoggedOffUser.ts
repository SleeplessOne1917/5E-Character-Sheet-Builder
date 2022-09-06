import { fetchLoggedInUsername } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useRedirectLoggedOffUser = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchLoggedInUsername()).then(result => {
			if (result.meta.requestStatus === 'fulfilled') {
				if (!result.payload) {
					router.back();
				}
			} else {
				router.back();
			}
		});
	}, [router, dispatch]);
};

export default useRedirectLoggedOffUser;
