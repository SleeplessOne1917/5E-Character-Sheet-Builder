import { gql } from 'urql/core';

const FORGOT_PASSWORD = gql`
	mutation ForgotPassword($request: ForgotPasswordRequest!) {
		forgotPassword(request: $request) {
			message
		}
	}
`;

export default FORGOT_PASSWORD;
