import LOG_OUT from '../graphql/mutations/user/logOut';
import { fetchLoggedInUsername } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';
import { useMutation } from 'urql';

const useLogout = () => {
	const [_, logOut] = useMutation(LOG_OUT);
	const dispatch = useAppDispatch();

	return () => {
		logOut().then(_ => {
			dispatch(fetchLoggedInUsername());
		});
	};
};

export default useLogout;
