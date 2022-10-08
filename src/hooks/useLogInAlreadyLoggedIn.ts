import {
	accessTokenKey,
	refreshTokenKey
} from './../constants/generalConstants';
import { useCallback, useEffect, useState } from 'react';

import GET_TOKEN from '../graphql/mutations/user/token';
import { fetchLoggedInUsername } from './../redux/features/viewer';
import { useAppDispatch } from './reduxHooks';
import useLogout from './useLogout';
import { useMutation } from 'urql';

const useLogInAlreadyLoggedIn = (loading: boolean) => {
	const dispatch = useAppDispatch();
	const [_, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const logout = useLogout();
	const [run, setRun] = useState(true);

	const logIn = useCallback(() => {
		dispatch(fetchLoggedInUsername()).then(result => {
			if (result.meta.requestStatus === 'fulfilled') {
				if (!result.payload) {
					const refreshToken = localStorage.getItem(refreshTokenKey);
					if (refreshToken) {
						getToken({ refreshToken }).then(tokenResult => {
							if (tokenResult.error || !tokenResult.data) {
								logout();
								return;
							}

							localStorage.setItem(accessTokenKey, tokenResult.data.token);
							dispatch(fetchLoggedInUsername());
						});
					}
				}
			}
		});
	}, [dispatch, getToken, logout]);

	useEffect(() => {
		let logInInterval: NodeJS.Timer;

		if (run && !loading) {
			console.log('logging in');
			logIn();
			logInInterval = setInterval(logIn, 1000 * 60 * 15);
			setRun(false);
		}

		return () => {
			clearInterval(logInInterval);
		};
	}, [logIn, run, loading]);
};

export default useLogInAlreadyLoggedIn;
