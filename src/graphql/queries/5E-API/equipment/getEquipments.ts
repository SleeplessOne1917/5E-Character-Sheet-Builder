import { gql } from 'urql/core';

const GET_EQUIPMENTS = gql`
	query Equipments {
		equipments(limit: 1000) {
			index
			name
			equipment_category {
				index
				name
			}
		}
	}
`;

export default GET_EQUIPMENTS;
