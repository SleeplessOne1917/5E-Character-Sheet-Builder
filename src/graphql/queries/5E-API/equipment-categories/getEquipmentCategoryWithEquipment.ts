import { gql } from 'urql/core';

const GET_EQUIPMENT_CATEGORY_WITH_EQUIPMENT = gql`
	query EquipmentCategory($index: String) {
		equipmentCategory(index: $index) {
			equipment(limit: 1000) {
				name
				index
			}
		}
	}
`;

export default GET_EQUIPMENT_CATEGORY_WITH_EQUIPMENT;
