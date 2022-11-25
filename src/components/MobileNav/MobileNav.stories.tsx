import { ComponentMeta, ComponentStory } from '@storybook/react';

import MobileNav from './MobileNav';

export default {
	title: 'Components/MobileNav',
	component: MobileNav,
	argTypes: {
		isOpen: { type: 'boolean' },
		onClickLink: { type: 'function' }
	}
} as ComponentMeta<typeof MobileNav>;

const Template: ComponentStory<typeof MobileNav> = args => (
	<MobileNav {...args} />
);

export const Closed = Template.bind({});
Closed.args = {
	isOpen: false
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
	isOpen: true
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
	isOpen: true,
	username: 'Foobius'
};
