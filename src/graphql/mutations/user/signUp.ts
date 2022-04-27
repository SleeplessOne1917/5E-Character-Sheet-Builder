import { gql } from 'urql';

const SIGN_UP = gql`
	mutation SignUp($user: AuthRequest) {
		signUp(user: $user) {
			email
		}
	}
`;

export default SIGN_UP;
