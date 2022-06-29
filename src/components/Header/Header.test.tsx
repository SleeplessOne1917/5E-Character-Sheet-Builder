import '@testing-library/jest-dom';

import * as stories from './Header.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { LoggedIn, LoggedOut } = composeStories(stories);

beforeAll(() => {
	const useRouter = jest.spyOn(require('next/router'), 'useRouter');
	const router = {
		push: () => Promise.resolve(),
		prefetch: () => Promise.resolve()
	};
	useRouter.mockReturnValue(router);
});

it('renders correctly', () => {
	render(<LoggedOut />);

	expect(screen.getByRole('banner')).toMatchSnapshot();
});

describe('has expected links', () => {
	it('when logged in', () => {
		render(<LoggedIn />);

		expect(screen.getByText(/Create/i)).toBeInTheDocument();
		expect(screen.queryByText(/Log In/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
		expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
	});

	it('when logged out', () => {
		render(<LoggedOut />);

		expect(screen.getByText(/Create/i)).toBeInTheDocument();
		expect(screen.getByText(/Log In/i)).toBeInTheDocument();
		expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
		expect(screen.queryByText(/Log Out/i)).not.toBeInTheDocument();
	});
});

it('calls onMenuIconClick when menu icon is clicked', async () => {
	const mockOnMenuIconClick = jest.fn();

	render(<LoggedOut onMenuIconClick={mockOnMenuIconClick} />);
	await userEvent.click(screen.getByTestId('menu'));

	expect(mockOnMenuIconClick).toHaveBeenCalled();
});
