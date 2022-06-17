import { gql } from 'urql';

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

	type AuthResponse {
		token: String!
	}

	type Query {
		viewer: String
	}

	type Mutation {
		signUp(user: SignUpRequest!): AuthResponse!
		logIn(user: LoginRequest!): AuthResponse!
		logOut: String
	}
`;

export default typeDefs;
