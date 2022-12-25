import { gql } from 'urql/core';

const GET_MAGIC_ITEMS = gql`
	query MagicItems {
		magicItems(limit: 1000) {
			name
			index
			equipment_category {
				index
				name
			}
		}
	}
`;

export default GET_MAGIC_ITEMS;
