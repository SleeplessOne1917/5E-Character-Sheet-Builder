import '@testing-library/jest-dom';

import * as stories from './Select.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Default, Error, Searchable } = composeStories(stories);

describe('renders correctly', () => {
	it('by default', () => {
		render(<Default />);

		expect(screen.getByTestId('select')).toMatchSnapshot();
	});

	it('with error state', () => {
		render(<Error />);

		expect(screen.getByTestId('select')).toMatchSnapshot();
	});

	it('with searchable state', () => {
		render(<Searchable />);

		expect(screen.getByTestId('select')).toMatchSnapshot();
	});
});

it('hides other options when closed', () => {
	render(<Default />);

	expect(screen.getByTestId('select-list')).toHaveStyle({ display: 'none' });
});

it('shows other options when open', async () => {
	render(<Default />);

	await userEvent.click(screen.getByTestId('select-button'));

	expect(screen.getByTestId('select-list')).toHaveStyle({ display: 'block' });
});

it('calls onChange and closes list when item is selected', async () => {
	const onChangeMock = jest.fn();
	render(<Default onChange={onChangeMock} />);

	await userEvent.click(screen.getByTestId('select-button'));
	await userEvent.click(screen.getByText(/Bar/i));

	expect(onChangeMock).toBeCalledWith('bar');
	expect(screen.getByTestId('select-list')).toHaveStyle({ display: 'none' });
});
