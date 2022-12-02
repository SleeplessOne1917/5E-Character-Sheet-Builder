import { gql } from 'urql/core';

const GET_SUBRACES = gql`
	query GetSubraces {
		subraces {
			index
			name
			race {
				index
			}
		}
	}
`;

export default GET_SUBRACES;
