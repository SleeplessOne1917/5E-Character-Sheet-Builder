import { gql } from '@urql/core';

const GET_EQUIPMENTS = gql`
	query Equipments {
		equipments(limit: 50) {
			index
			name
		}
	}
`;

export default GET_EQUIPMENTS;
