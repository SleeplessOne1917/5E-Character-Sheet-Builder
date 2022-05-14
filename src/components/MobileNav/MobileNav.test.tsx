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
	let container: HTMLElement;

	act(() => {
		container = render(<LoggedOut />).container;
	});

	expect(container.firstChild).toMatchSnapshot();
});

it('is closed when closed', () => {
	let container: HTMLElement;

	act(() => {
		container = render(<Closed />).container;
	});

	const { classList } = container.querySelector('nav') as HTMLElement;

	expect(classList).not.toContain('open');
});

it('is open when open', () => {
	let container;

	act(() => {
		container = render(<LoggedIn />).container;
	});

	const { classList } = container.querySelector('nav') as HTMLElement;

	expect(classList).toContain('open');
});

describe('contains expected links', () => {
	it('when logged in', () => {
		act(() => {
			render(<LoggedIn />);
		});

		expect(screen.queryByText(/Create/i)).toBeInTheDocument();
		expect(screen.queryByText(/Log In/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/Log Out/i)).toBeInTheDocument();
	});

	it('when logged out', () => {
		act(() => {
			render(<LoggedOut />);
		});

		expect(screen.queryByText(/Create/i)).toBeInTheDocument();
		expect(screen.queryByText(/Log In/i)).toBeInTheDocument();
		expect(screen.queryByText(/Sign Up/i)).toBeInTheDocument();
		expect(screen.queryByText(/Log Out/i)).not.toBeInTheDocument();
	});
});

it('calls onClickLink when link is clicked', async () => {
	const mockOnClickLink = jest.fn();

	act(() => {
		render(<LoggedOut onClickLink={mockOnClickLink} />);
	});
	await act(async () => {
		await userEvent.click(screen.getAllByRole('link').at(0) as HTMLElement);
	});

	expect(mockOnClickLink).toHaveBeenCalled();
});
