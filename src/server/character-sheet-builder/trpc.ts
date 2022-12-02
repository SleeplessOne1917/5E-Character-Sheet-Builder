import { TRPCError, initTRPC } from '@trpc/server';

import { Context } from './context';

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
	const session = ctx.session;
	if (!session?.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED'
		});
	}
	return next({
		ctx: {
			session,
			user: ctx.user
		}
	});
});

export const router = t.router;
export const procedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
