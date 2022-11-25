import { gql } from 'urql/core';

const GET_CLASSES = gql`
	query Classes {
		classes {
			index
			name
		}
	}
`;

export default GET_CLASSES;
