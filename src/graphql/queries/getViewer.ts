import { gql } from 'urql';

const GET_VIEWER = gql`
	query GetViewer {
		viewer
	}
`;

export default GET_VIEWER;
