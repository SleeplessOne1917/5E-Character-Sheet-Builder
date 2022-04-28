import { gql } from 'urql';

const LOG_IN = gql`
	mutation LogIn($user: AuthRequest!) {
		logIn(user: $user) {
			token
		}
	}
`;

export default LOG_IN;
