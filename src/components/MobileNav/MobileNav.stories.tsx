import { ComponentMeta, ComponentStory } from '@storybook/react';
import { configureStore, createSlice } from '@reduxjs/toolkit';

import MobileNav from './MobileNav';
import { Provider } from 'react-redux';

const MockStore = ({ mockState, children }) => (
	<Provider
		store={configureStore({
			reducer: {
				viewer: createSlice({
					name: 'viewer',
					initialState: mockState,
					reducers: {}
				}).reducer
			}
		})}
	>
		{children}
	</Provider>
);

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
	story => <MockStore mockState={null}>{story()}</MockStore>
];
Closed.args = {
	isOpen: false
};

export const LoggedOut = Template.bind({});
LoggedOut.decorators = [
	story => <MockStore mockState={null}>{story()}</MockStore>
];
LoggedOut.args = {
	isOpen: true
};

export const LoggedIn = Template.bind({});
LoggedIn.decorators = [
	story => <MockStore mockState={'email@email.com'}>{story()}</MockStore>
];
LoggedIn.args = {
	isOpen: true
};
