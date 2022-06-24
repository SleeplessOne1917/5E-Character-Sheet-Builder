import { useEffect, useState } from 'react';

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../components/MainContent/MainContent';
import REMIND_USERNAME from '../../graphql/mutations/user/remindUsername';
import classes from './UsernameReminder.module.css';
import { cleanMessage } from '../../services/messageCleanerService';
import { useMutation } from 'urql';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';

type UsernameReminderProps = {
	otlId: string;
};

const UsernameReminder = ({ otlId }: UsernameReminderProps) => {
	const [loading, setLoading] = useState(true);
	const [{ error, data }, remindUsername] = useMutation(REMIND_USERNAME);
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		if (otlId) {
			remindUsername({ otlId }).then(() => {
				setLoading(false);
			});
		}
	}, [otlId, setLoading, remindUsername]);

	useEffect(() => {
		if (error) {
			startCountdown();
		}
	}, [startCountdown, error]);

	let headerText = 'Loading...';
	let content = (
		<div className={classes['spinner-container']}>
			<LoadingSpinner />
		</div>
	);

	if (loading === false) {
		if (error) {
			headerText = 'Error';
			content = (
				<>
					<div className={classes['error-message']}>
						{cleanMessage(error.message)}
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
						<span className={classes.username}>{data?.remindUsername}</span>
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
	}

	return (
		<MainContent>
			<div className={classes.content}>
				<h1>{headerText}</h1>
				{content}
			</div>
		</MainContent>
	);
};

export default UsernameReminder;
