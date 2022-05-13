import { gql } from 'urql';

const GET_SUBRACE = gql`
	query GetSubrace($filter: FilterFindOneSubraceInput) {
		subrace(filter: $filter) {
			desc
			index
			name
		}
	}
`;

export default GET_SUBRACE;
