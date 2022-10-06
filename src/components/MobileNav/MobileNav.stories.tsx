import { ComponentMeta, ComponentStory } from '@storybook/react';

import MobileNav from './MobileNav';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';
import loggedInViewerMock from '../../mock/loggedInViewerMock';

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
Closed.decorators = [
	Story => (
		<Provider store={getTestStore()}>
			<Story />
		</Provider>
	)
];
Closed.args = {
	isOpen: false
};

export const LoggedOut = Template.bind({});
LoggedOut.decorators = [
	Story => (
		<Provider store={getTestStore()}>
			<Story />
		</Provider>
	)
];
LoggedOut.args = {
	isOpen: true
};

export const LoggedIn = Template.bind({});
LoggedIn.decorators = [
	Story => (
		<Provider store={getTestStore({ viewer: loggedInViewerMock })}>
			<Story />
		</Provider>
	)
];
LoggedIn.args = {
	isOpen: true
};
