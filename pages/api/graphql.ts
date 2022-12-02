import { NextApiRequest, NextApiResponse } from 'next';

import { ApolloContext } from '../../src/types/apollo';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import dbConnect from '../../src/db/dbConnect';
import schema from '../../src/graphql/server/schema';

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
		return { req, res };
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
