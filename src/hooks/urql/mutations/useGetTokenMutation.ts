import { Operation, useMutation } from 'urql';

import GET_TOKEN from '../../../graphql/mutations/user/token';

type GetTokenData = { token: string };

type GetTokenVariables = { refreshToken: string };

const useGetTokenMutation = () =>
	useMutation<GetTokenData, GetTokenVariables>(GET_TOKEN);

export default useGetTokenMutation;

export type GetTokenOperation = Operation<GetTokenData, GetTokenVariables>;
