import '@testing-library/jest-dom';

import * as stories from './Toast.stories';

import { act, render } from '@testing-library/react';

import { Provider } from 'react-redux';
import Toast from './Toast';
import { ToastType } from '../../types/toast';
import { composeStories } from '@storybook/testing-react';
import { show } from '../../redux/features/toast';
import { store } from '../../redux/store';

const { Success, Error } = composeStories(stories);

it('renders correctly', () => {
	let container: HTMLElement;

	act(() => {
		container = render(
			<Provider store={store}>
				<Toast />
			</Provider>
		).container;
	});

	expect(container.firstChild).toMatchSnapshot();
});

it('success renders expected content', () => {
	let container: HTMLElement;

	act(() => {
		container = render(<Success />).container;
	});

	const toast = container.firstChild as HTMLElement;
	expect(toast.classList).toContain('toast-success');
	expect(toast.classList).not.toContain('toast-error');
	expect(container.querySelector('.error-icon')).not.toBeInTheDocument();
	expect(container.querySelector('.success-icon')).toBeInTheDocument();
});

it('error renders expected content', () => {
	let container: HTMLElement;

	act(() => {
		container = render(<Error />).container;
	});

	const toast = container.firstChild as HTMLElement;
	expect(toast.classList).not.toContain('toast-success');
	expect(toast.classList).toContain('toast-error');
	expect(container.querySelector('.error-icon')).toBeInTheDocument();
	expect(container.querySelector('.success-icon')).not.toBeInTheDocument();
});

it('does not contain open class when closed', () => {
	let container: HTMLElement;

	act(() => {
		container = render(
			<Provider store={store}>
				<Toast />
			</Provider>
		).container;
	});

	expect(container.querySelector('.open')).not.toBeInTheDocument();
});

it('contains open class when open', () => {
	let container: HTMLElement;

	act(() => {
		container = render(<Success />).container;
	});

	expect(container.querySelector('.open')).toBeInTheDocument();
});

it('closes itself after closeTimeoutSeconds seconds', async () => {
	let container: HTMLElement;

	act(() => {
		container = render(
			<Provider store={store}>
				<Toast />
			</Provider>
		).container;

		store.dispatch(
			show({ type: ToastType.success, closeTimeoutSeconds: 3, message: 'foo' })
		);
	});

	await new Promise(resolve => setTimeout(resolve, 1000));
	expect(container.querySelector('.open')).toBeInTheDocument();
	await new Promise(resolve => setTimeout(resolve, 2000));
	expect(container.querySelector('.open')).not.toBeInTheDocument();
});
