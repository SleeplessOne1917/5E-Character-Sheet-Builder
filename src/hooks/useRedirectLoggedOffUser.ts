import { fetchLoggedInUsername } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useRedirectLoggedOffUser = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		dispatch(fetchLoggedInUsername()).then(result => {
			if (result.meta.requestStatus === 'fulfilled') {
				if (!result.payload) {
					router.back();
				} else {
					setLoading(false);
				}
			} else {
				router.back();
			}
		});
	}, [router, dispatch]);

	return { loading };
};

export default useRedirectLoggedOffUser;
