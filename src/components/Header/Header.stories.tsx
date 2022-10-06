import { ComponentMeta, ComponentStory } from '@storybook/react';

import Header from './Header';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';
import loggedInViewerMock from '../../mock/loggedInViewerMock';

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
LoggedOut.decorators = [
	Story => (
		<Provider store={getTestStore()}>
			<Story />
		</Provider>
	)
];

export const LoggedIn = Template.bind({});
LoggedIn.decorators = [
	Story => (
		<Provider store={getTestStore({ viewer: loggedInViewerMock })}>
			<Story />
		</Provider>
	)
];
