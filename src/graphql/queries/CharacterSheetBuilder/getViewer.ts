import { gql } from 'urql/core';

const GET_VIEWER = gql`
	query GetViewer {
		viewer
	}
`;

export default GET_VIEWER;
