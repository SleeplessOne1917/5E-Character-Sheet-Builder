import '@testing-library/jest-dom';

import * as stories from './Toast.stories';

import { act, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import Toast from './Toast';
import { ToastType } from '../../types/toast';
import { composeStories } from '@storybook/testing-react';
import { getStore } from '../../redux/store';
import { show } from '../../redux/features/toast';
import userEvent from '@testing-library/user-event';

const { Success, Error } = composeStories(stories);

it('renders correctly', () => {
	render(
		<Provider store={getStore()}>
			<Toast />
		</Provider>
	);

	expect(screen.getByRole('alert')).toMatchSnapshot();
});

it('success renders expected content', () => {
	render(<Success />);

	const toast = screen.getByRole('alert');
	expect(toast).toHaveClass('toast-success');
	expect(toast).not.toHaveClass('toast-error');
	expect(screen.getByRole('img')).not.toHaveClass('error-icon');
	expect(screen.getByRole('img')).toHaveClass('success-icon');
});

it('error renders expected content', () => {
	render(<Error />);

	const toast = screen.getByRole('alert');
	expect(toast).not.toHaveClass('toast-success');
	expect(toast).toHaveClass('toast-error');
	expect(screen.getByRole('img')).toHaveClass('error-icon');
	expect(screen.getByRole('img')).not.toHaveClass('success-icon');
});

it('does not contain open class when closed', () => {
	render(
		<Provider store={getStore()}>
			<Toast />
		</Provider>
	);

	expect(screen.getByRole('alert')).not.toHaveClass('open');
});

it('contains open class when open', () => {
	render(<Success />);

	expect(screen.getByRole('alert')).toHaveClass('open');
});

it('closes itself after closeTimeoutSeconds seconds', async () => {
	jest.useFakeTimers();
	const store = getStore();

	render(
		<Provider store={store}>
			<Toast />
		</Provider>
	);

	await waitFor(() =>
		store.dispatch(
			show({ type: ToastType.success, closeTimeoutSeconds: 3, message: 'foo' })
		)
	);

	expect(screen.getByRole('alert')).toHaveClass('open');

	act(() => {
		jest.advanceTimersByTime(3000);
	});
	expect(screen.getByRole('alert')).not.toHaveClass('open');
});

describe('x button tab index', () => {
	it('is -1 when closed', () => {
		render(
			<Provider store={getStore()}>
				<Toast />
			</Provider>
		);

		expect(screen.getByRole('button').tabIndex).toBe(-1);
	});

	it('is 0 when open', () => {
		render(<Success />);

		expect(screen.getByRole('button').tabIndex).toBe(0);
	});
});

describe('closes the toast when x button is pressed', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		userEvent.setup({ delay: null });
	});

	it('with click', async () => {
		const store = getStore();

		render(
			<Provider store={store}>
				<Toast />
			</Provider>
		);

		await waitFor(() =>
			store.dispatch(
				show({
					type: ToastType.success,
					closeTimeoutSeconds: 999,
					message: 'foo'
				})
			)
		);

		expect(screen.getByRole('alert')).toHaveClass('open');

		await waitFor(async () => {
			await userEvent.click(screen.getByRole('button'));
		});

		expect(screen.getByRole('alert')).not.toHaveClass('open');
	});

	it('with enter', async () => {
		const store = getStore();

		render(
			<Provider store={store}>
				<Toast />
			</Provider>
		);

		await waitFor(() =>
			store.dispatch(
				show({
					type: ToastType.success,
					closeTimeoutSeconds: 999,
					message: 'foo'
				})
			)
		);

		expect(screen.getByRole('alert')).toHaveClass('open');

		await waitFor(async () => {
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');
		});

		expect(screen.getByRole('alert')).not.toHaveClass('open');
	});

	it('with space', async () => {
		const store = getStore();

		render(
			<Provider store={store}>
				<Toast />
			</Provider>
		);

		await waitFor(() =>
			store.dispatch(
				show({
					type: ToastType.success,
					closeTimeoutSeconds: 999,
					message: 'foo'
				})
			)
		);

		expect(screen.getByRole('alert')).toHaveClass('open');

		await waitFor(async () => {
			await userEvent.tab();
			await userEvent.keyboard(' ');
		});

		expect(screen.getByRole('alert')).not.toHaveClass('open');
	});
});
