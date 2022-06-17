import { gql } from 'urql';

const SIGN_UP = gql`
	mutation SignUp($user: SignUpRequest!) {
		signUp(user: $user) {
			token
		}
	}
`;

export default SIGN_UP;
