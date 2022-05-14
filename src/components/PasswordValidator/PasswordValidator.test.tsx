import '@testing-library/jest-dom';

import * as stories from './PasswordValidator.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const {
	EmptyPassword,
	LowercaseLetterPassword,
	MinLengthPassword,
	NoPassword,
	NumberPassword,
	SpecialCharPassword,
	UppercaseLetterPassword,
	ValidPassword
} = composeStories(stories);

it('renders correctly', () => {
	const { container } = render(<ValidPassword />);
	expect(container.getElementsByClassName('container')[0]).toMatchSnapshot();
});

describe('has no matching sections', () => {
	it('when password is not passed in', () => {
		const { container } = render(<NoPassword />);

		const noMatches = container.getElementsByClassName('no-match');
		const xs = container.getElementsByClassName('x');
		const matches = container.getElementsByClassName('match');
		const checks = container.getElementsByClassName('check');

		expect(noMatches).toHaveLength(5);
		expect(xs).toHaveLength(5);
		expect(matches).toHaveLength(0);
		expect(checks).toHaveLength(0);
	});

	it('when password is empty', () => {
		const { container } = render(<EmptyPassword />);

		const noMatches = container.getElementsByClassName('no-match');
		const xs = container.getElementsByClassName('x');
		const matches = container.getElementsByClassName('match');
		const checks = container.getElementsByClassName('check');

		expect(noMatches).toHaveLength(5);
		expect(xs).toHaveLength(5);
		expect(matches).toHaveLength(0);
		expect(checks).toHaveLength(0);
	});
});

describe('has expected matches for', () => {
	it('lowercase letters', () => {
		render(<LowercaseLetterPassword />);

		const element = screen.getByText(/lowercase/i);

		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('uppercase letters', () => {
		render(<UppercaseLetterPassword />);

		const element = screen.getByText(/uppercase/i);

		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('min length letters', () => {
		render(<MinLengthPassword />);

		const element = screen.getByText(/characters long/i);

		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('numbers', () => {
		render(<NumberPassword />);

		const element = screen.getByText(/number/i);

		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('special characters', () => {
		render(<SpecialCharPassword />);

		const element = screen.getByText(/special character/i);

		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});
});

it('has all matches when password is valid', () => {
	const { container } = render(<ValidPassword />);

	const noMatches = container.getElementsByClassName('no-match');
	const xs = container.getElementsByClassName('x');
	const matches = container.getElementsByClassName('match');
	const checks = container.getElementsByClassName('check');

	expect(noMatches).toHaveLength(0);
	expect(xs).toHaveLength(0);
	expect(matches).toHaveLength(5);
	expect(checks).toHaveLength(5);
});
