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

	type ForgotResponse {
		message: String!
	}

	input ForgotUsernameRequest {
		email: String!
	}

	input ForgotPasswordRequest {
		email: String!
		username: String!
	}

	type Mutation {
		signUp(user: SignUpRequest!): AuthResponse!
		logIn(user: LoginRequest!): AuthResponse!
		logOut: String
		forgotUsername(request: ForgotUsernameRequest!): ForgotResponse!
		forgotPassword(request: ForgotPasswordRequest!): ForgotResponse!
	}
`;

export default typeDefs;
