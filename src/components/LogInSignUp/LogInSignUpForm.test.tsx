import '@testing-library/jest-dom';

import * as stories from './LogInSignUpForm.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';

const { LogIn, SignUp } = composeStories(stories);

describe('renders correctly', () => {
	it('when log in', () => {
		render(<LogIn />);

		expect(screen.getByTestId('form')).toMatchSnapshot();
	});

	it('when sign up', () => {
		render(<SignUp />);

		expect(screen.getByTestId('form')).toMatchSnapshot();
	});
});

it('toggles show password when eye icon is pressed', async () => {
	render(<SignUp />);

	const passwordField = screen.getByLabelText(
		/^Password$/i
	) as HTMLInputElement;
	expect(screen.queryByLabelText(/Hide Password/i)).not.toBeInTheDocument();
	expect(passwordField.type).toBe('password');

	await userEvent.click(screen.getByLabelText(/Show Password/i));
	expect(screen.queryByLabelText(/Show Password/i)).not.toBeInTheDocument();
	expect(passwordField.type).toBe('text');

	await userEvent.click(screen.getByLabelText(/Hide Password/i));
	expect(screen.queryByLabelText(/Hide Password/i)).not.toBeInTheDocument();
	expect(passwordField.type).toBe('password');
});

describe('error text', () => {
	it('only shows for username after blur', async () => {
		render(<LogIn />);

		expect(screen.queryByText(/Username is required/i)).not.toBeInTheDocument();

		await userEvent.tab();
		await userEvent.tab();
		await userEvent.tab();

		expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
	});

	it('only shows for password after blur', async () => {
		render(<LogIn />);

		expect(screen.queryByText(/Password is required/i)).not.toBeInTheDocument();

		await userEvent.tab();
		await userEvent.tab();
		await userEvent.tab();

		expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
	});

	it('only shows for email after blur', async () => {
		render(<SignUp />);

		expect(
			screen.queryByText(/Enter your email in the format/i)
		).not.toBeInTheDocument();

		await userEvent.type(screen.getByLabelText(/Email/i), 'notAnEmail');
		await userEvent.tab();

		expect(
			screen.getByText(/Enter your email in the format/i)
		).toBeInTheDocument();
	});
});
