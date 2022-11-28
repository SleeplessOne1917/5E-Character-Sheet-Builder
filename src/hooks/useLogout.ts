import { signOut } from 'next-auth/react';

const useLogout = () => {
	return async () => {
		await signOut({ callbackUrl: '/' });
	};
};

export default useLogout;
