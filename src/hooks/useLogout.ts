import LOG_OUT from '../graphql/mutations/user/logOut';
import { fetchLoggedInEmail } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';
import { useMutation } from 'urql';

const useLogout = () => {
	const [logOutResult, logOut] = useMutation(LOG_OUT);
	const dispatch = useAppDispatch();

	return () => {
		logOut().then(result => {
			dispatch(fetchLoggedInEmail());
		});
	};
};

export default useLogout;
