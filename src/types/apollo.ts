import { NextApiRequest, NextApiResponse } from 'next';

export type ApolloContext = {
	username: string | null;
	req: NextApiRequest;
	res: NextApiResponse;
};
