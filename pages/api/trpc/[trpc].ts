import * as trpcNext from '@trpc/server/adapters/next';

import { appRouter } from '../../../src/server/character-sheet-builder/routers/_app';
import { createContext } from '../../../src/server/character-sheet-builder/context';

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext
});
