import { gql } from 'urql/core';

const CREATE_SUBRACE = gql`
	mutation CreateSubrace($subrace: SubraceInput!) {
		createSubrace(subrace: $subrace)
	}
`;

export default CREATE_SUBRACE;
