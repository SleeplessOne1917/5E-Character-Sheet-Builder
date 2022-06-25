import MainContent from '../../components/MainContent/MainContent';
import classes from './404.module.css';
import { useEffect } from 'react';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';

const Four04 = () => {
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		startCountdown();
	}, [startCountdown]);

	return (
		<MainContent testId="404">
			<div className={classes.content}>
				<div className={`${classes.text} ${classes.four04}`}>404</div>
				<div className={`${classes.text} ${classes['not-found']}`}>
					Page not found.
				</div>
				<div className={`${classes.text} ${classes.blurb}`}>
					Redirecting to the home page in{' '}
					<span className={classes.countdown}>
						{secondsLeft} second{secondsLeft === 1 ? '' : 's'}
					</span>
					.
				</div>
			</div>
		</MainContent>
	);
};

export default Four04;
