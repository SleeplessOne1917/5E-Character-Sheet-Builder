import '@testing-library/jest-dom';

import * as stories from './PasswordValidator.stories';

import { act, render, screen } from '@testing-library/react';

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
	let container: HTMLElement;

	act(() => {
		container = render(<ValidPassword />).container;
	});

	expect(container.getElementsByClassName('container')[0]).toMatchSnapshot();
});

describe('has no matching sections', () => {
	it('when password is not passed in', () => {
		let container: HTMLElement;

		act(() => {
			container = render(<NoPassword />).container;
		});

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
		let container: HTMLElement;

		act(() => {
			container = render(<EmptyPassword />).container;
		});

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
		act(() => {
			render(<LowercaseLetterPassword />);
		});

		const element = screen.getByText(/lowercase/i);
		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('uppercase letters', () => {
		act(() => {
			render(<UppercaseLetterPassword />);
		});

		const element = screen.getByText(/uppercase/i);
		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('min length letters', () => {
		act(() => {
			render(<MinLengthPassword />);
		});

		const element = screen.getByText(/characters long/i);
		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('numbers', () => {
		act(() => {
			render(<NumberPassword />);
		});

		const element = screen.getByText(/number/i);
		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});

	it('special characters', () => {
		act(() => {
			render(<SpecialCharPassword />);
		});

		const element = screen.getByText(/special character/i);
		expect(element.classList).toContain('match');
		expect(element.classList).not.toContain('no-match');
		expect(element.querySelector('.x')).not.toBeInTheDocument();
		expect(element.querySelector('.check')).toBeInTheDocument();
	});
});

it('has all matches when password is valid', () => {
	let container: HTMLElement;

	act(() => {
		container = render(<ValidPassword />).container;
	});

	const noMatches = container.getElementsByClassName('no-match');
	const xs = container.getElementsByClassName('x');
	const matches = container.getElementsByClassName('match');
	const checks = container.getElementsByClassName('check');
	expect(noMatches).toHaveLength(0);
	expect(xs).toHaveLength(0);
	expect(matches).toHaveLength(5);
	expect(checks).toHaveLength(5);
});
