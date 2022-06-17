import { NextApiRequest, NextApiResponse } from 'next';

import { ApolloContext } from '../../src/types/apollo';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import dbConnect from '../../src/db/dbConnect';
import jwt from 'jsonwebtoken';
import nookies from 'nookies';
import schema from '../../src/graphql/server/schema';

const cors = Cors();

const apolloServer = new ApolloServer({
	schema,
	context: ({
		req,
		res
	}: {
		req: NextApiRequest;
		res: NextApiResponse;
	}): ApolloContext => {
		const token = nookies.get({ req }).token;

		let email: string | null;
		try {
			email = (
				jwt.verify(token, process.env.JWT_SECRET as string) as { email: string }
			).email;
		} catch (error) {
			email = null;
		}

		return { email, req, res };
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
