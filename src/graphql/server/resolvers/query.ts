import { ApolloContext } from './../../../types/apollo';

const Query = {
	viewer: async (parent, args, { username }: ApolloContext) => username
};

export default Query;
