import { ComponentMeta, ComponentStory } from '@storybook/react';

import Account from './Account';
import { CreateNewPasswordOperation } from '../../hooks/urql/mutations/useCreateNewPasswordMutation';
import { GetTokenOperation } from '../../hooks/urql/mutations/useGetTokenMutation';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { UrqlResponse } from '../../types/urqlTypes';
import { getOperationName } from 'urql';
import { getTestStore } from '../../redux/store';
import { getUrqlParameter } from '../../services/urqlStorybookService';
import loggedInViewerMock from '../../mock/loggedInViewerMock';

const MockStore = ({ children }: PropsWithChildren) => (
	<Provider store={getTestStore({ viewer: loggedInViewerMock })}>
		{children}
	</Provider>
);

export default {
	title: 'Views/Account',
	component: Account,
	args: { loading: false },
	decorators: [
		Story => (
			<MockStore>
				<Story />
			</MockStore>
		)
	]
} as ComponentMeta<typeof Account>;

const Template: ComponentStory<typeof Account> = args => <Account {...args} />;

export const Default = Template.bind({});

const defaultUrql = (
	operation: CreateNewPasswordOperation | GetTokenOperation
) =>
	getUrqlParameter(operation, operation => {
		if (getOperationName(operation.query) === 'CreateNewPassword') {
			return {
				data: { createNewPassword: 'It succeeded!' }
			} as UrqlResponse<CreateNewPasswordOperation>;
		} else {
			// The operation is getToken
			return { data: { token: 'token' } } as UrqlResponse<GetTokenOperation>;
		}
	});

Default.parameters = {
	urql: defaultUrql
};
