import { gql } from 'urql';

const GET_TOKEN = gql`
	mutation GetToken($refreshToken: String!) {
		token(refreshToken: $refreshToken)
	}
`;

export default GET_TOKEN;
