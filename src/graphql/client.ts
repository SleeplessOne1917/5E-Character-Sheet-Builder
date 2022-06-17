import {
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange
} from 'urql';

const client = createClient({
	url: `/api/graphql`,
	exchanges: [dedupExchange, cacheExchange, fetchExchange],
	preferGetMethod: true
});

export default client;
