import { gql } from 'urql/core';

const typeDefs = gql`
	input LoginRequest {
		username: String!
		password: String!
	}

	input SignUpRequest {
		username: String!
		password: String!
		email: String
	}
`;

export default typeDefs;
