import { gql } from 'urql';

const GET_SUBRACE = gql`
	query GetSubrace($index: String) {
		subrace(index: $index) {
			desc
			index
			name
			ability_bonuses {
				bonus
				ability_score {
					index
					full_name
				}
			}
			racial_traits {
				name
				index
				desc
			}
		}
	}
`;

export default GET_SUBRACE;
