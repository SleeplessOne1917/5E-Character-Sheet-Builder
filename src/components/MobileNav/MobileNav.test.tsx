import '@testing-library/jest-dom';

import * as stories from './MobileNav.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { Closed, LoggedIn, LoggedOut } = composeStories(stories);
import * as Router from 'next/router';

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
