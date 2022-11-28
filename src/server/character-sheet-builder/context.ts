import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import dbConnect from '../../db/dbConnect';
import { inferAsyncReturnType } from '@trpc/server';
import { nextAuthOptions } from '../../common/auth';
import { unstable_getServerSession } from 'next-auth';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	await dbConnect();
	const session = await unstable_getServerSession(req, res, nextAuthOptions);

	return { req, res, session };
};

export type Context = inferAsyncReturnType<typeof createContext>;
