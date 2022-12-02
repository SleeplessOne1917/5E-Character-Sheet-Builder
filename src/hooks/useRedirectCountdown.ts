import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

type RedirectCountdownArgs = {
	seconds: number;
	path: string;
	replace?: boolean;
};

type RedirectCountdownReturn = {
	secondsLeft: number;
	startCountdown: () => void;
};

const useRedirectCountdown = ({
	seconds,
	path,
	replace
}: RedirectCountdownArgs): RedirectCountdownReturn => {
	const router = useRouter();
	const [secondsLeft, setSecondsLeft] = useState(seconds);
	const [countingDown, setCountingDown] = useState(false);

	useEffect(() => {
		let redirectTimeout: NodeJS.Timeout;
		let countdownInterval: NodeJS.Timer;

		if (countingDown) {
			redirectTimeout = setTimeout(() => {
				if (replace) {
					router.replace(path);
				} else {
					router.push(path);
				}
			}, seconds * 1000);
			countdownInterval = setInterval(() => {
				setSecondsLeft(prevState => prevState - 1);
			}, 1000);
		}

		return () => {
			if (redirectTimeout) {
				clearTimeout(redirectTimeout);
			}

			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
		};
	}, [seconds, path, countingDown, setSecondsLeft, router, replace]);

	const startCountdown = useCallback(() => {
		setCountingDown(true);
	}, [setCountingDown]);

	return {
		secondsLeft,
		startCountdown
	};
};

export default useRedirectCountdown;
