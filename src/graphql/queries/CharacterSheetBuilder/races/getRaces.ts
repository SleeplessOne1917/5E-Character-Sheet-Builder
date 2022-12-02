import { gql } from 'urql/core';

const GET_RACES = gql`
	query GetRaces($limit: Int, $skip: Int) {
		races(limit: $limit, skip: $skip) {
			races {
				id
				name
			}
			count
		}
	}
`;

export default GET_RACES;
