import { gql } from 'urql';

const typeDefs = gql`
	type Query {
		hello: String!
	}
`;

export default typeDefs;
