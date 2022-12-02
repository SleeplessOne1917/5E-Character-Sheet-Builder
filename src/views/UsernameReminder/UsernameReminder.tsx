'use client';

import { useEffect, useState } from 'react';

import LoadingPageContent from '../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../components/MainContent/MainContent';
import classes from './UsernameReminder.module.css';
import { trpc } from '../../common/trpcNext';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';

type UsernameReminderProps = {
	otlId: string;
};

const UsernameReminder = ({ otlId }: UsernameReminderProps) => {
	const [fetched, setFetched] = useState(false);
	const remindUsernameMutation = trpc.username.remind.useMutation();
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		if (!fetched) {
			remindUsernameMutation.mutate(otlId);
			setFetched(true);
		}
	}, [remindUsernameMutation, otlId, fetched]);

	useEffect(() => {
		if (remindUsernameMutation.error) {
			startCountdown();
		}
	}, [startCountdown, remindUsernameMutation.error]);

	let headerText: string;
	let content: JSX.Element;

	if (remindUsernameMutation.error) {
		headerText = 'Error';
		content = (
			<>
				<div className={classes['error-message']}>
					{remindUsernameMutation.error.message}
				</div>
				<p className={classes['countdown-message']}>
					You will be redirected back to the home page in{' '}
					<span className={classes.countdown}>
						{secondsLeft} second{secondsLeft === 1 ? '' : 's'}
					</span>
					.
				</p>
			</>
		);
	} else {
		headerText = 'Username Reminder';
		content = (
			<>
				<div className={classes['username-message']}>
					Your username is:{' '}
					<span className={classes.username}>
						{remindUsernameMutation.data}
					</span>
				</div>
				<p className={classes['username-warning']}>
					Be sure to write down your username{' '}
					<strong className={classes.emphasis}>
						before refreshing the page
					</strong>{' '}
					or you&apos;ll have to request another link
				</p>
			</>
		);
	}

	const isLoading = remindUsernameMutation.isLoading || !fetched;

	return (
		<>
			{isLoading && <LoadingPageContent />}
			{!isLoading && (
				<MainContent>
					<div className={classes.content}>
						<h1>{headerText}</h1>
						{content}
					</div>
				</MainContent>
			)}
		</>
	);
};

export default UsernameReminder;
