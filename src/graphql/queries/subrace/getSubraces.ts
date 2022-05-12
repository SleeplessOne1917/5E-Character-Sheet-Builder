import { gql } from 'urql';

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
