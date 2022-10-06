import '@testing-library/jest-dom';

import * as Router from 'next/router';
import * as stories from './Header.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { LoggedIn, LoggedOut } = composeStories(stories);

beforeAll(() => {
	const useRouter = jest.spyOn(Router, 'useRouter');
	const router: Router.NextRouter = {
		push: () => Promise.resolve(true),
		prefetch: () => Promise.resolve(),
		route: '',
		query: {},
		pathname: '',
		asPath: '',
		basePath: '',
		isLocaleDomain: true,
		reload: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
		beforePopState: jest.fn(),
		events: { emit: jest.fn(), on: jest.fn(), off: jest.fn() },
		isFallback: false,
		isPreview: false,
		isReady: true
	};
	useRouter.mockReturnValue(router);
});

describe('renders correctly', () => {
	it('when logged out', () => {
		render(<LoggedOut />);

		expect(screen.getByRole('banner')).toMatchSnapshot();
	});

	it('when logged in', () => {
		render(<LoggedIn />);

		expect(screen.getByRole('banner')).toMatchSnapshot();
	});
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
