import { gql } from 'urql/core';

const GET_SPELLCASTING_CLASSES = gql`
	query GetSpellcastingClasses {
		classes {
			index
			name
			spellcasting {
				level
			}
		}
	}
`;

export default GET_SPELLCASTING_CLASSES;
