import {
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
	makeOperation
} from 'urql';
import { useEffect, useState } from 'react';

import { accessTokenKey } from './../constants/generalConstants';
import { authExchange } from '@urql/exchange-auth';
import jwt from 'jsonwebtoken';

/* eslint-disable @typescript-eslint/ban-ts-comment */
const defaultClient = createClient({
	url: `/api/graphql`,
	exchanges: [dedupExchange, cacheExchange, fetchExchange]
});

export const createAuthClient = () =>
	createClient({
		url: `/api/graphql`,
		exchanges: [
			dedupExchange,
			cacheExchange,
			authExchange({
				getAuth: async ({ authState }) => {
					if (!authState) {
						const accessToken = localStorage.getItem(accessTokenKey);
						if (accessToken) {
							return { accessToken };
						}
						return null;
					}

					return authState;
				},
				addAuthToOperation: ({ authState, operation }) => {
					/* @ts-ignore */
					if (!authState || !authState.accessToken) {
						return operation;
					}

					const fetchOptions =
						typeof operation.context.fetchOptions === 'function'
							? operation.context.fetchOptions()
							: operation.context.fetchOptions || {};

					return makeOperation(operation.kind, operation, {
						...operation.context,
						fetchOptions: {
							...fetchOptions,
							headers: {
								...fetchOptions.headers,
								/* @ts-ignore */
								Authorization: `Bearer ${authState.accessToken}`
							},
							credentials: 'include'
						}
					});
				},
				willAuthError: ({ authState }) => {
					try {
						jwt.verify(
							/* @ts-ignore */
							authState.accessToken,
							process.env.NEXT_PUBLIC_JWT_SECRET as string
						);
					} catch (e) {
						return true;
					}

					return false;
				}
			}),
			fetchExchange
		],
		requestPolicy: 'cache-and-network'
	});

export const useUrqlClient = () => {
	const [client, setClient] = useState(defaultClient);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setClient(createAuthClient());
		setLoading(false);
	}, []);

	return { loading, client };
};

export default defaultClient;
