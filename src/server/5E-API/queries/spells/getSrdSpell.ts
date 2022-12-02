import { gql } from 'urql/core';

const GET_SRD_SPELL = gql`
	query Spell($index: String!) {
		spell(index: $index) {
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

export default GET_SRD_SPELL;
