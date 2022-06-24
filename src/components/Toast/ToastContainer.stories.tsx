import { ComponentMeta, ComponentStory } from '@storybook/react';

import Button from '../Button/Button';
import { Provider } from 'react-redux';
import ToastContainer from './ToastContainer';
import { ToastType } from '../../types/toast';
import { getTestStore } from '../../redux/store';
import { show } from '../../redux/features/toast';
import { useAppDispatch } from '../../hooks/reduxHooks';

export default {
	title: 'Components/ToastContainer',
	component: ToastContainer
} as ComponentMeta<typeof ToastContainer>;

const Template: ComponentStory<typeof ToastContainer> = (args: any) => (
	<ToastContainer {...args} />
);

export const Success = Template.bind({});
Success.decorators = [
	story => {
		const store = getTestStore();
		return (
			<Provider store={store}>
				<Button
					size="medium"
					onClick={() =>
						store.dispatch(
							show({
								closeTimeoutSeconds: 10,
								message: 'Success Message',
								type: ToastType.success
							})
						)
					}
				>
					Show Toast
				</Button>
				{story()}
			</Provider>
		);
	}
];

export const Error = Template.bind({});
Error.decorators = [
	story => {
		const store = getTestStore();
		return (
			<Provider store={store}>
				<Button
					size="medium"
					onClick={() =>
						store.dispatch(
							show({
								closeTimeoutSeconds: 10,
								message: 'Error Message',
								type: ToastType.error
							})
						)
					}
				>
					Show Toast
				</Button>
				{story()}
			</Provider>
		);
	}
];
