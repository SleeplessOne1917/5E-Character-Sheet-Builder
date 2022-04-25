import Mutation from './mutation';

const resolvers = {
	Mutation,
	Query: {
		hello: () => 'hello graphql'
	}
};

export default resolvers;
