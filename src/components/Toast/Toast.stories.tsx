import { ComponentMeta, ComponentStory } from '@storybook/react';
import { configureStore, createSlice } from '@reduxjs/toolkit';

import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import Toast from './Toast';
import { ToastState } from '../../redux/features/toast';
import { ToastType } from '../../types/toast';

const MockStore = ({
	mockState,
	children
}: PropsWithChildren<{ mockState: Partial<ToastState> }>) => (
	<Provider
		store={configureStore({
			reducer: {
				toast: createSlice({
					name: 'toast',
					initialState: {
						isOpen: true,
						closeTimeoutSeconds: 9999,
						...mockState
					},
					reducers: {}
				}).reducer
			}
		})}
	>
		{children}
	</Provider>
);

export default {
	name: 'Components/Toast',
	component: Toast
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = () => <Toast />;

export const Success = Template.bind({});
Success.decorators = [
	story => (
		<MockStore
			mockState={{
				type: ToastType.success,
				message: 'This is a success message.'
			}}
		>
			{story()}
		</MockStore>
	)
];

export const Error = Template.bind({});
Error.decorators = [
	story => (
		<MockStore
			mockState={{
				type: ToastType.error,
				message: 'This is an error message.'
			}}
		>
			{story()}
		</MockStore>
	)
];
