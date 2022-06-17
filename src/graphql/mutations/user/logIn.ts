import { gql } from 'urql';

const LOG_IN = gql`
	mutation LogIn($user: LoginRequest!) {
		logIn(user: $user) {
			token
		}
	}
`;

export default LOG_IN;
