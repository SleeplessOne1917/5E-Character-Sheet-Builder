import LOGOUT from '../graphql/mutations/user/logout';
import { useMutation } from 'urql';

const useLogout = () => {
	const [_, logout] = useMutation<{ logout: string }, undefined>(LOGOUT);

	return async () => {
		await logout(undefined);
	};
};

export default useLogout;
