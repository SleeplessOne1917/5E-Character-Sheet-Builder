import * as stories from './Button.stories';

import { act, render, screen } from '@testing-library/react';

import { ButtonType } from './Button';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Default, Disabled, Large, Positive, Small, Submit } =
	composeStories(stories);

it('renders correctly', () => {
	act(() => {
		render(<Default />);
	});

	expect(screen.getByRole('button')).toMatchSnapshot();
});

it('uses default margin when no spacing is passed', () => {
	act(() => {
		render(<Default />);
	});

	const margin = screen.getByRole('button').style.margin;
	expect(margin).toBe('0.25rem');
});

it('uses default type when no type is passed', () => {
	act(() => {
		render(<Default />);
	});

	const { type }: HTMLButtonElement = screen.getByRole('button');
	expect(type).toBe(ButtonType.button);
});

describe('uses the expected font size and padding for passed in size', () => {
	it('when medium', () => {
		act(() => {
			render(<Default />);
		});

		const { fontSize, padding } = screen.getByRole('button').style;
		expect(fontSize).toBe('1.3rem');
		expect(padding).toBe('1rem');
	});

	it('when large', () => {
		act(() => {
			render(<Large />);
		});

		const { fontSize, padding } = screen.getByRole('button').style;
		expect(fontSize).toBe('2.5rem');
		expect(padding).toBe('1rem');
	});

	it('when small', () => {
		act(() => {
			render(<Small />);
		});

		const { fontSize, padding } = screen.getByRole('button').style;

		expect(fontSize).toBe('0.7rem');
		expect(padding).toBe('0.3rem');
	});
});

it('calls onClick when clicked', async () => {
	const onClickMock = jest.fn();

	act(() => {
		render(<Default onClick={onClickMock} />);
	});
	await act(async () => {
		const button = screen.getByRole('button');

		await userEvent.click(button);
	});

	expect(onClickMock).toHaveBeenCalled();
});

it('does not call onClick when disabled', async () => {
	const onClickMock = jest.fn();

	act(() => {
		render(<Disabled onClick={onClickMock} />);
	});
	await act(async () => {
		const button = screen.getByRole('button');

		await userEvent.click(button);
	});

	expect(onClickMock).not.toHaveBeenCalled();
});

it('has expected classes when positive is not passed in', () => {
	act(() => {
		render(<Default />);
	});

	const { classList } = screen.getByRole('button');
	expect(classList).toContain('negative');
	expect(classList).not.toContain('positive');
});

it('has expected classes when positive is passed in', () => {
	act(() => {
		render(<Positive />);
	});

	const { classList } = screen.getByRole('button');
	expect(classList).not.toContain('negative');
	expect(classList).toContain('positive');
});

it('has submit type when passed in', () => {
	act(() => {
		render(<Submit />);
	});

	const { type }: HTMLButtonElement = screen.getByRole('button');
	expect(type).toBe(ButtonType.submit);
});
