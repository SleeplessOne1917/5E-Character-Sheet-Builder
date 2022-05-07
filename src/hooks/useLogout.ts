import LOG_OUT from '../graphql/mutations/user/logOut';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const useLogout = () => {
	const router = useRouter();
	const [logOutResult, logOut] = useMutation(LOG_OUT);

	return () => {
		logOut().then(result => {
			router.reload();
		});
	};
};

export default useLogout;
