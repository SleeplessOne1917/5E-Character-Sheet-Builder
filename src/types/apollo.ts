import { NextApiRequest, NextApiResponse } from 'next';

import { IUserDocument } from '../db/models/user';

export type ApolloContext = {
	user?: IUserDocument;
	req: NextApiRequest;
	res: NextApiResponse;
};
