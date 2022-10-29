import { gql } from 'urql';

const GET_LANGUAGES = gql`
	query GetLanguages {
		languages {
			index
			name
		}
	}
`;

export default GET_LANGUAGES;
