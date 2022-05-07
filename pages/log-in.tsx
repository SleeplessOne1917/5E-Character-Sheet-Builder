import LogInView from '../src/views/LogInSignUp/LogIn/LogIn';
import { NextPage } from 'next';
import { useAppSelector } from '../src/hooks/reduxHooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LogInPage: NextPage = () => {
	const router = useRouter();
	const viewer = useAppSelector(state => state.viewer);

	useEffect(() => {
		if (viewer) {
			router.replace('/');
		}
	}, [router, viewer]);

	return <LogInView />;
};

export default LogInPage;
