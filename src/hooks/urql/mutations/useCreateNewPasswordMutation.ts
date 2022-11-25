import CREATE_NEW_PASSWORD from '../../../graphql/mutations/user/createNewPassword';
import { useMutation } from 'urql';

type CreateNewPasswordData = { createNewPassword: string };

type CreateNewPasswordVariables = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const useCreateNewPasswordMutation = () =>
	useMutation<CreateNewPasswordData, CreateNewPasswordVariables>(
		CREATE_NEW_PASSWORD
	);

export default useCreateNewPasswordMutation;
