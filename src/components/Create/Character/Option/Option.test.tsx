import '@testing-library/jest-dom';

import * as stories from './Option.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';

const { OnlyOption, OptionWithMultipleSubOptions, OptionWithOneSubOption } =
	composeStories(stories);

it('renders correctly', () => {
	render(<OnlyOption />);

	expect(screen.getByTestId(/option/i)).toMatchSnapshot();
});

describe('has correct chevron', () => {
	it('when only race', () => {
		render(<OnlyOption />);

		expect(screen.getByTestId(/chevron-right/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});

	it('when only one subrace', () => {
		render(<OptionWithOneSubOption />);

		expect(screen.getByTestId(/chevron-right/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});

	it('when multiple subraces collapsed', () => {
		render(<OptionWithMultipleSubOptions />);

		expect(screen.queryByTestId(/chevron-right/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.getByTestId(/chevron-down/i)).toBeInTheDocument();
	});

	it('when multiple subraces expanded', async () => {
		render(<OptionWithMultipleSubOptions />);

		await userEvent.click(screen.getByText(/Dwarf/i));

		expect(screen.queryByTestId(/chevron-right/i)).not.toBeInTheDocument();
		expect(screen.getByTestId(/chevron-up/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});
});

it('does not call onChoose when race is clicked and there are multiple subraces', async () => {
	const onChooseMock = jest.fn();

	render(<OptionWithMultipleSubOptions onChoose={onChooseMock} />);

	await userEvent.click(screen.getByText(/Dwarf/i));

	expect(onChooseMock).not.toHaveBeenCalled();
});

describe('onChoose', () => {
	describe('click', () => {
		it('is called with no arguments when no subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OnlyOption onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithOneSubOption onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithMultipleSubOptions onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));
			await userEvent.click(screen.getByText(/Mountain Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith('mountain-dwarf');
		});
	});

	describe('on enter press', () => {
		it('is called with no arguments when no subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OnlyOption onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithOneSubOption onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithMultipleSubOptions onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');
			await userEvent.tab();
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');

			expect(onChooseMock).toHaveBeenCalledWith('mountain-dwarf');
		});
	});

	describe('on space press', () => {
		it('is called with no arguments when no subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OnlyOption onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithOneSubOption onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OptionWithMultipleSubOptions onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');
			await userEvent.tab();
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith('mountain-dwarf');
		});
	});
});
