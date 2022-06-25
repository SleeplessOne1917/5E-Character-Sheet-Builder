import { ComponentMeta, ComponentStory } from '@storybook/react';

import Account from './Account';

export default {
	title: 'Views/Account',
	component: Account
} as ComponentMeta<typeof Account>;

const Template: ComponentStory<typeof Account> = () => <Account />;

export const Default = Template.bind({});
