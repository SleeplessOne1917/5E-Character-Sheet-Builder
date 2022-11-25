'use client';

import LinkButton from '../../../components/LinkButton/LinkButton';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import classes from './ForgotIndex.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ForgotIndexType = {
	username?: string;
};

const ForgotIndex = ({ username }: ForgotIndexType) => {
	const router = useRouter();

	useEffect(() => {
		if (username) {
			router.replace;
		}
	}, [username, router]);

	return (
		<>
			{username && <LoadingPageContent />}
			{!username && (
				<MainContent testId="forgot-index">
					<div className={classes.content}>
						<h1 className={classes['header-text']}>Forgot Something?</h1>
						<div className={classes['button-container']}>
							<LinkButton href="/forgot/username">Forgot username</LinkButton>
							<LinkButton href="/forgot/password">Forgot password</LinkButton>
						</div>
					</div>
				</MainContent>
			)}
		</>
	);
};

export default ForgotIndex;
