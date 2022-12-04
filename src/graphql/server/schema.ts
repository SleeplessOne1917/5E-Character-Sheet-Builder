import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/resolvers';
import typeDefs from './typeDefs/typeDefs';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
