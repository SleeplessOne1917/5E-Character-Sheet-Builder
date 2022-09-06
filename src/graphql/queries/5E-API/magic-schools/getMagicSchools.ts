import { gql } from 'urql';

const GET_MAGIC_SCHOOLS = gql`
	query GetMagicSchools {
		magicSchools {
			name
			index
		}
	}
`;

export default GET_MAGIC_SCHOOLS;
