import {
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange
} from 'urql';

const client = createClient({
	url: `/api/graphql`,
	exchanges: [dedupExchange, cacheExchange, fetchExchange],
	requestPolicy: 'cache-and-network'
});

export default client;
