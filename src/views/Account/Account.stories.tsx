import { ComponentMeta, ComponentStory } from '@storybook/react';

import Account from './Account';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';
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
