import {
	Cache,
	DataFields,
	Variables,
	cacheExchange
} from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange } from 'urql';

const invalidateViewer = (
	result: DataFields,
	args: Variables,
	cache: Cache
) => {
	const key = 'Query';
	cache
		.inspectFields(key)
		.filter(field => field.fieldName === 'viewer')
		.forEach(field => {
			cache.invalidate(key, field.fieldKey);
		});
};

const defaultClient = createClient({
	url: `/api/graphql`,
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					signUp: invalidateViewer,
					logIn: invalidateViewer,
					logout: invalidateViewer
				}
			}
		}),
		fetchExchange
	]
});

export default defaultClient;
