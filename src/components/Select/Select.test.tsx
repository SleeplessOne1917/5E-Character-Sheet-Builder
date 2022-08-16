import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as stories from './Select.stories';
import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('select')).toMatchSnapshot();
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

it('changes button text, calls onChange, and closes list when item is selected', async () => {
	const onChangeMock = jest.fn();
	render(<Default onChange={onChangeMock} />);

	await userEvent.click(screen.getByTestId('select-button'));
	await userEvent.click(screen.getByText(/Bar/i));

	expect(onChangeMock).toBeCalledWith('bar');
	expect(screen.getByTestId('select-button')).toHaveTextContent(/Bar/i);
	expect(screen.getByTestId('select-list')).toHaveStyle({ display: 'none' });
});
