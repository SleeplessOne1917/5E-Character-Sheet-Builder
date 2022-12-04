import { gql } from 'urql/core';

const GET_SUBRACES = gql`
	query GetSubraces($limit: Int, $skip: Int) {
		subraces(limit: $limit, skip: $skip) {
			subraces {
				id
				name
			}
			count
		}
	}
`;

export default GET_SUBRACES;
