import { ComponentMeta, ComponentStory } from '@storybook/react';
import Header, { HeaderProps } from './Header';
import { configureStore, createSlice } from '@reduxjs/toolkit';

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

const HeaderSb = {
	title: 'Components/Header',
	component: Header,
	argTypes: {
		onLogoIconClick: { type: 'function' },
		onMenuIconClick: { type: 'function' }
	}
} as ComponentMeta<typeof Header>;

export default HeaderSb;

const Template: ComponentStory<typeof Header> = (args: HeaderProps) => (
	<Header {...args} />
);

export const LoggedOut = Template.bind({});
LoggedOut.decorators = [
	story => <MockStore mockState={null}>{story()}</MockStore>
];

export const LoggedIn = Template.bind({});
LoggedIn.decorators = [
	story => <MockStore mockState="foo@bar.com">{story()}</MockStore>
];
