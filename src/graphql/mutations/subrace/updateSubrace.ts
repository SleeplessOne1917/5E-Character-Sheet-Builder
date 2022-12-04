import { gql } from 'urql/core';

const UPDATE_SUBRACE = gql`
	mutation UpdateSubrace($id: ID!, $subrace: SubraceInput!) {
		updateSubrace(id: $id, subrace: $subrace)
	}
`;

export default UPDATE_SUBRACE;
