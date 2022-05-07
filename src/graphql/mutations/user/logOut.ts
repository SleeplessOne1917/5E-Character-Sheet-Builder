import { gql } from 'urql';

const LOG_OUT = gql`
	mutation LogOut {
		logOut
	}
`;

export default LOG_OUT;
