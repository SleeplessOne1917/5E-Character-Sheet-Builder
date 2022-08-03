import { gql } from 'urql';

const GET_EQUIPMENTS = gql`
	query Equipments {
		equipments(limit: 50) {
			index
			name
		}
	}
`;

export default GET_EQUIPMENTS;
