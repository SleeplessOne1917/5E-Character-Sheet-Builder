import { gql } from 'urql/core';

const GET_MAGIC_SCHOOLS = gql`
	query GetMagicSchools {
		magicSchools {
			name
			index
		}
	}
`;

export default GET_MAGIC_SCHOOLS;
