import { ComponentMeta, ComponentStory } from '@storybook/react';

import Account from './Account';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';

const MockStore = ({ children }: { children: ReactNode }) => (
	<Provider store={getTestStore()}>{children}</Provider>
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

const Template: ComponentStory<typeof Account> = () => <Account />;

export const Default = Template.bind({});
