import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '../server/character-sheet-builder/routers/_app';

const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		// browser should use relative path
		return '';
	}

	if (process.env.ORIGIN) {
		return process.env.ORIGIN;
	}

	return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/api/trpc`
		})
	]
});
