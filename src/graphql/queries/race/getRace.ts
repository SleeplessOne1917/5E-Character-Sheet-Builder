import { gql } from 'urql';

const GET_RACE = gql`
	query GetRace($filter: FilterFindOneRaceInput) {
		race(filter: $filter) {
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
