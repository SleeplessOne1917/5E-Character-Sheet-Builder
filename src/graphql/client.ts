import {
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
	makeOperation
} from 'urql';

import { authExchange } from '@urql/exchange-auth';
import jwt from 'jsonwebtoken';

const getAuth = async ({ authState }) => {
	const token = localStorage.getItem('5etoken');

	if (!authState) {
		if (token) {
			return { token };
		}
		return null;
	}

	if (token) {
		const decoded = jwt.decode(token) as jwt.JwtPayload;

		if (decoded.exp !== undefined && decoded.exp < Date.now() / 1000) {
			return { token };
		}
	}

	return null;
};

const addAuthToOperation = ({ authState, operation }) => {
	if (!authState || !authState.token) {
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
				Authorization: authState.token
			}
		}
	});
};

const client = createClient({
	url: `api/graphql`,
	exchanges: [
		dedupExchange,
		cacheExchange,
		authExchange({ getAuth, addAuthToOperation }),
		fetchExchange
	]
});

export default client;
