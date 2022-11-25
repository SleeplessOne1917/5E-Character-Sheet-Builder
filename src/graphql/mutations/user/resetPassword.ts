import { gql } from 'urql/core';

const RESET_PASSWORD = gql`
	mutation ResetPassword(
		$otlId: String!
		$password: String!
		$confirmPassword: String!
	) {
		resetPassword(
			otlId: $otlId
			password: $password
			confirmPassword: $confirmPassword
		)
	}
`;

export default RESET_PASSWORD;
