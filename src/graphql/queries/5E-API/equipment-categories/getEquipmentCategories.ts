import { gql } from 'urql/core';

const GET_EQUIPMENT_CATEGORIES = gql`
	query EquipmentCategories {
		equipmentCategories {
			index
			name
		}
	}
`;

export default GET_EQUIPMENT_CATEGORIES;
