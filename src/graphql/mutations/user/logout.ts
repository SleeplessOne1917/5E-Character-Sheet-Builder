import { gql } from 'urql/core';

const LOGOUT = gql`
	mutation Logout {
		logout
	}
`;

export default LOGOUT;
