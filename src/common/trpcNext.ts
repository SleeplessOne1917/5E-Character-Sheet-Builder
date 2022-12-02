import type { AppRouter } from '../server/character-sheet-builder/routers/_app';
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';

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

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
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
		};
	},
	ssr: true
});
