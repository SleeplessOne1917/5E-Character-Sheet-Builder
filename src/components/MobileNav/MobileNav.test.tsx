import '@testing-library/jest-dom';

import * as stories from './MobileNav.stories';

import { act, render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Closed, LoggedIn, LoggedOut } = composeStories(stories);

beforeAll(() => {
	const useRouter = jest.spyOn(require('next/router'), 'useRouter');
	const router = {
		push: () => Promise.resolve(),
		prefetch: () => Promise.resolve()
	};
	useRouter.mockReturnValue(router);
});

it('renders correctly', () => {
	render(<LoggedOut />).container;

	expect(screen.getByRole('navigation')).toMatchSnapshot();
});

it('is closed when closed', () => {
	render(<Closed />).container;

	expect(screen.getByRole('navigation')).not.toHaveClass('open');
});

it('is open when open', () => {
	render(<LoggedIn />).container;

	expect(screen.getByRole('navigation')).toHaveClass('open');
});

describe('contains expected links', () => {
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

it('calls onClickLink when link is clicked', async () => {
	const mockOnClickLink = jest.fn();

	render(<LoggedOut onClickLink={mockOnClickLink} />);
	await userEvent.click(screen.getAllByRole('link').at(0) as HTMLElement);

	expect(mockOnClickLink).toHaveBeenCalled();
});
