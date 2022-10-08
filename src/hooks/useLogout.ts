import {
	accessTokenKey,
	refreshTokenKey
} from './../constants/generalConstants';

import { fetchLoggedInUsername } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';

const useLogout = () => {
	const dispatch = useAppDispatch();

	return () => {
		localStorage.removeItem(accessTokenKey);
		localStorage.removeItem(refreshTokenKey);
		dispatch(fetchLoggedInUsername());
	};
};

export default useLogout;
