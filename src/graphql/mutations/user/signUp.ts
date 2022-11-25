import { gql } from 'urql/core';

const SIGN_UP = gql`
	mutation SignUp($user: SignUpRequest!) {
		signUp(user: $user)
	}
`;

export default SIGN_UP;
