import { NextApiRequest, NextApiResponse } from 'next';

export type ApolloContext = {
	email: string;
	req: NextApiRequest;
	res: NextApiResponse;
};
