import { gql } from 'urql';

const GET_SPELLS_BY_CLASS = gql`
	query SpellsByClass($class: StringFilter) {
		spells(class: $class) {
			index
			name
			level
			components
			casting_time
			concentration
			desc
			school {
				name
				index
			}
			damage {
				damage_type {
					name
					index
				}
			}
			material
			range
			ritual
		}
	}
`;

export default GET_SPELLS_BY_CLASS;
