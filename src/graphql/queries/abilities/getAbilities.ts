import { gql } from 'urql';

const GET_ABILITIES = gql`
	query Abilities {
		abilityScores {
			index
			name
		}
	}
`;

export default GET_ABILITIES;
