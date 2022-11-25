import { gql } from 'urql/core';

const GET_SPELLS = gql`
	query GetSpells(
		$limit: Int
		$skip: Int
		$name: String
		$level: Int
		$school: String
		$class: String
	) {
		spells(
			limit: $limit
			skip: $skip
			name: $name
			level: $level
			school: $school
			class: $class
		) {
			count
			spells {
				id
				name
				level
				school {
					id
					name
				}
			}
		}
	}
`;

export default GET_SPELLS;
