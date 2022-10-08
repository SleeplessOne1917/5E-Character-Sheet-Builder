import { gql } from 'urql';

const GET_SPELLS_BY_CLASS = gql`
	query SpellsByClass($class: StringFilter) {
		spells(class: $class, limit: 500) {
			index
			name
			level
			components
			casting_time
			concentration
			duration
			higher_level
			desc
			classes {
				index
				name
			}
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
