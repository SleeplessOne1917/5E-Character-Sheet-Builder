import { gql } from 'urql/core';

const typeDefs = gql`
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
`;

export default typeDefs;
