import { gql } from 'urql';

const GET_RACE = gql`
	query GetRace($index: String) {
		race(index: $index) {
			ability_bonuses {
				ability_score {
					index
				}
				bonus
			}
			age
			alignment
			index
			language_desc
			name
			size
			size_description
			speed
			traits {
				name
				index
				desc
			}
		}
	}
`;

export default GET_RACE;
