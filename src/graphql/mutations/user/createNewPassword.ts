import { gql } from 'urql';

const CREATE_NEW_PASSWORD = gql`
	mutation CreateNewPassword(
		$currentPassword: String!
		$newPassword: String!
		$confirmPassword: String!
	) {
		createNewPassword(
			currentPassword: $currentPassword
			newPassword: $newPassword
			confirmPassword: $confirmPassword
		)
	}
`;

export default CREATE_NEW_PASSWORD;
