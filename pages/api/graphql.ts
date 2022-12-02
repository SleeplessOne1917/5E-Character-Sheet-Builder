import { NextApiRequest, NextApiResponse } from 'next';

import { ApolloContext } from '../../src/types/apollo';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { IUserDocument } from '../../src/db/models/user';
import User from '../../src/db/models/user';
import dbConnect from '../../src/db/dbConnect';
import { nextAuthOptions } from '../../src/common/auth';
import schema from '../../src/graphql/server/schema';
import { unstable_getServerSession } from 'next-auth';

const cors = Cors();

const apolloServer = new ApolloServer({
	schema,
	context: async ({
		req,
		res
	}: {
		req: NextApiRequest;
		res: NextApiResponse;
	}): Promise<ApolloContext> => {
		const session = await unstable_getServerSession(req, res, nextAuthOptions);

		let user: IUserDocument | undefined;

		if (session && session.user) {
			user = await User.findOne({ username: session.user.name }).lean();
		}

		return { req, res, user };
	}
});

export const config = {
	api: {
		bodyParser: false
	}
};

const startServer = apolloServer.start();

export default cors(async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}

	await dbConnect();

	await startServer;
	await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});
