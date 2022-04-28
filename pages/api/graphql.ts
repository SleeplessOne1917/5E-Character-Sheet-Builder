import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import dbConnect from '../../src/db/dbConnect';
import jwt from 'jsonwebtoken';
import schema from '../../src/graphql/server/schema';

const cors = Cors();

const apolloServer = new ApolloServer({
	schema,
	context: ({ req }) => {
		let token = req.headers.authorization;
		if (token) {
			const regexResult = /(?:Bearer )(.*)/.exec(token);
			if (regexResult && regexResult[1]) {
				token = regexResult[1];
			}
		}

		let email: string | null;
		try {
			email = jwt.verify(token, process.env.JWT_SECRET as string).email;
		} catch (error) {
			console.log(error);
			email = null;
		}

		return { email };
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
