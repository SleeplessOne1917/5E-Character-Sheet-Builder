import { createClient, dedupExchange, fetchExchange } from 'urql';

import { cacheExchange } from '@urql/exchange-graphcache';

const defaultClient = createClient({
	url: `/api/graphql`,
	exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
});

export default defaultClient;
