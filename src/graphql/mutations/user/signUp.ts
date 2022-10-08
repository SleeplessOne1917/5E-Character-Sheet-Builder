import { gql } from 'urql';

const SIGN_UP = gql`
	mutation SignUp($user: SignUpRequest!) {
		signUp(user: $user) {
			accessToken
			refreshToken
		}
	}
`;

export default SIGN_UP;
