import { NextApiRequest, NextApiResponse } from 'next';

import { ApolloContext } from '../../src/types/apollo';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import dbConnect from '../../src/db/dbConnect';
import jwt from 'jsonwebtoken';
import schema from '../../src/graphql/server/schema';

const cors = Cors();

const apolloServer = new ApolloServer({
	schema,
	context: ({
		req
	}: {
		req: NextApiRequest;
		res: NextApiResponse;
	}): ApolloContext => {
		const token = req.headers.authorization?.replace('Bearer ', '') ?? '';

		let username: string | null;
		try {
			username = (
				jwt.verify(token, process.env.JWT_SECRET as string) as {
					username: string;
				}
			).username;
		} catch (error) {
			username = null;
		}

		return { username };
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