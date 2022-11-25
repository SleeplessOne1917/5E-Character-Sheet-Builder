import { gql } from 'urql/core';

const LOG_IN = gql`
	mutation LogIn($user: LoginRequest!) {
		logIn(user: $user)
	}
`;

export default LOG_IN;
