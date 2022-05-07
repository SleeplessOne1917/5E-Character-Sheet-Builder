import { ApolloContext } from './../../../types/apollo';

const Query = {
	viewer: async (parent, args, { email }: ApolloContext) => email
};

export default Query;
