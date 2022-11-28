import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import { AppRouter } from '../server/character-sheet-builder/routers/_app';

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
			/**
			 * If you want to use SSR, you need to use the server's full URL
			 * @link https://trpc.io/docs/ssr
			 **/
			url: `${getBaseUrl()}/api/trpc`,
			headers: {
				'x-ssr': '1'
			}
		})
	]
});
