import { gql } from 'urql';

const GET_ABILITIES = gql`
	query Abilities {
		abilityScores {
			index
			full_name
		}
	}
`;

export default GET_ABILITIES;
