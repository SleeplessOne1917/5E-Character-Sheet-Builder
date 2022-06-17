import { NextApiRequest, NextApiResponse } from 'next';

export type ApolloContext = {
	email: string | null;
	req: NextApiRequest;
	res: NextApiResponse;
};
