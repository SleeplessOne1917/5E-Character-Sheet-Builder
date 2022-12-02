import { gql } from 'urql/core';

const FORGOT_USERNAME = gql`
	mutation ForgotUsername($request: ForgotUsernameRequest!) {
		forgotUsername(request: $request) {
			message
		}
	}
`;

export default FORGOT_USERNAME;
