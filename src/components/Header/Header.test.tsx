import '@testing-library/jest-dom';

import * as stories from './Header.stories';

import { act, render, screen } from '@testing-library/react';

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
	act(() => {
		render(<LoggedOut />);
	});

	expect(screen.getByRole('banner')).toMatchSnapshot();
});

describe('has expected links', () => {
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

it('calls onLogoIconClick when logo icon is clicked', async () => {
	const mockOnLogoIconClick = jest.fn();

	act(() => {
		render(<LoggedOut onLogoIconClick={mockOnLogoIconClick} />);
	});
	await act(async () => {
		const header = screen.getByRole('banner');
		await userEvent.click(header.querySelector('.logo') as HTMLElement);
	});

	expect(mockOnLogoIconClick).toHaveBeenCalled();
});

it('calls onMenuIconClick when menu icon is clicked', async () => {
	const mockOnMenuIconClick = jest.fn();

	act(() => {
		render(<LoggedOut onMenuIconClick={mockOnMenuIconClick} />);
	});
	await act(async () => {
		const header = screen.getByRole('banner');
		await userEvent.click(header.querySelector('.menu-icon') as HTMLElement);
	});

	expect(mockOnMenuIconClick).toHaveBeenCalled();
});
