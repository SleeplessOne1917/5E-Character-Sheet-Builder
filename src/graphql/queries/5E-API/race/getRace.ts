import { gql } from 'urql';

const GET_RACE = gql`
	query GetRace($index: String) {
		race(index: $index) {
			ability_bonuses {
				ability_score {
					index
					full_name
				}
				bonus
			}
			ability_bonus_options {
				choose
				from {
					options {
						bonus
						ability_score {
							index
							full_name
						}
					}
				}
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
