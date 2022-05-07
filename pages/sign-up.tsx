import { NextPage } from 'next';
import SignUpView from '../src/views/LogInSignUp/SignUp/SignUp';
import { useAppSelector } from '../src/hooks/reduxHooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignUpPage: NextPage = () => {
	const router = useRouter();
	const viewer = useAppSelector(state => state.viewer);

	useEffect(() => {
		if (viewer) {
			router.replace('/');
		}
	}, [router, viewer]);

	return <SignUpView />;
};

export default SignUpPage;
