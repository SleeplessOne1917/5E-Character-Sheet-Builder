import { gql } from 'urql/core';

const GET_MONSTER_TYPES = gql`
	query MonsterTypes($type: MonsterTypeFilter) {
		humanoids: monsters(limit: 600, type: $type) {
			subtype
		}
		monsters(limit: 600) {
			type
		}
	}
`;

export default GET_MONSTER_TYPES;
