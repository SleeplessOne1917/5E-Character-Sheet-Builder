import { gql } from 'urql';

const GET_SRD_SPELLS = gql`
	query SpellsByClass($class: StringFilter) {
		spells(class: $class, limit: 500) {
			index
			name
			level
			school {
				name
				index
			}
		}
	}
`;

export default GET_SRD_SPELLS;
