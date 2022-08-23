import {
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange
} from 'urql';

const client = createClient({
	url: `/api/graphql`,
	exchanges: [dedupExchange, cacheExchange, fetchExchange]
});

export default client;
