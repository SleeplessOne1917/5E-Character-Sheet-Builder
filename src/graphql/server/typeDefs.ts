import { gql } from 'urql';

const typeDefs = gql`
	input AuthRequest {
		email: String!
		password: String!
	}

	type AuthResponse {
		token: String!
	}

	type Query {
		viewer: String
	}

	type Mutation {
		signUp(user: AuthRequest!): AuthResponse!
		logIn(user: AuthRequest!): AuthResponse!
		logOut: String
	}
`;

export default typeDefs;
