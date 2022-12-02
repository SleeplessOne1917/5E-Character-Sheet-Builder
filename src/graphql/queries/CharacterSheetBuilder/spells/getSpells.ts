import { gql } from 'urql/core';

const GET_SPELLS = gql`
	query GetSpells($limit: Int, $skip: Int, $class: String) {
		spells(limit: $limit, skip: $skip, class: $class) {
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
