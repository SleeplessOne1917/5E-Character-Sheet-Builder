import { gql } from 'urql/core';

const VALIDATE_RESET_PASSWORD = gql`
	mutation ValidateResetPassword($otlId: String!) {
		validateResetPassword(otlId: $otlId)
	}
`;

export default VALIDATE_RESET_PASSWORD;
