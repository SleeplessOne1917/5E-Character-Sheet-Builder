import { gql } from '@urql/core';

const GET_DAMAGE_TYPES = gql`
	query GetDamageTypes {
		damageTypes {
			name
			index
		}
	}
`;

export default GET_DAMAGE_TYPES;
