import { gql } from '@urql/core';

const GET_PROFICIENCIES_BY_TYPE = gql`
	query ProficienciesByType($type: ProficiencyTypeFilter) {
		proficiencies(type: $type) {
			name
			index
			type
		}
	}
`;

export default GET_PROFICIENCIES_BY_TYPE;
