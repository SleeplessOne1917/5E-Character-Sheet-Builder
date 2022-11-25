import { ComponentMeta, ComponentStory } from '@storybook/react';

import Header from './Header';

export default {
	title: 'Components/Header',
	component: Header,
	argTypes: {
		onLogoIconClick: { type: 'function' },
		onMenuIconClick: { type: 'function' }
	}
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = args => <Header {...args} />;

export const LoggedOut = Template.bind({});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
	username: 'Foobius'
};
