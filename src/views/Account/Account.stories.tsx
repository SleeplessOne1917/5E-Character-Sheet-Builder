import { ComponentMeta, ComponentStory } from '@storybook/react';

import Account from './Account';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';

const MockStore = ({ children }: PropsWithChildren) => (
	<Provider store={getTestStore()}>{children}</Provider>
);

export default {
	title: 'Views/Account',
	component: Account,
	args: { username: 'Lolbert' },
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
