import '@testing-library/jest-dom';

import * as stories from './RaceOption.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { OnlyRace, RaceWithMultipleSubraces, RaceWithOneSubrace } =
	composeStories(stories);

it('renders correctly', () => {
	render(<OnlyRace />);

	expect(screen.getByTestId(/race-option/i)).toMatchSnapshot();
});

describe('has correct chevron', () => {
	it('when only race', () => {
		render(<OnlyRace />);

		expect(screen.getByTestId(/chevron-right/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});

	it('when only one subrace', () => {
		render(<RaceWithOneSubrace />);

		expect(screen.getByTestId(/chevron-right/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});

	it('when multiple subraces collapsed', () => {
		render(<RaceWithMultipleSubraces />);

		expect(screen.queryByTestId(/chevron-right/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-up/i)).not.toBeInTheDocument();
		expect(screen.getByTestId(/chevron-down/i)).toBeInTheDocument();
	});

	it('when multiple subraces expanded', async () => {
		render(<RaceWithMultipleSubraces />);

		await userEvent.click(screen.getByText(/Dwarf/i));

		expect(screen.queryByTestId(/chevron-right/i)).not.toBeInTheDocument();
		expect(screen.getByTestId(/chevron-up/i)).toBeInTheDocument();
		expect(screen.queryByTestId(/chevron-down/i)).not.toBeInTheDocument();
	});
});

it('does not call onChoose when race is clicked and there are multiple subraces', async () => {
	const onChooseMock = jest.fn();

	render(<RaceWithMultipleSubraces onChoose={onChooseMock} />);

	await userEvent.click(screen.getByText(/Dwarf/i));

	expect(onChooseMock).not.toHaveBeenCalled();
});

describe('onChoose', () => {
	describe('click', () => {
		it('is called with no arguments when no subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OnlyRace onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithOneSubrace onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithMultipleSubraces onChoose={onChooseMock} />);
			await userEvent.click(screen.getByText(/Dwarf/i));
			await userEvent.click(screen.getByText(/Mountain Dwarf/i));

			expect(onChooseMock).toHaveBeenCalledWith('mountain-dwarf');
		});
	});

	describe('on enter press', () => {
		it('is called with no arguments when no subraces', async () => {
			const onChooseMock = jest.fn();

			render(<OnlyRace onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithOneSubrace onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard('{Enter}');

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithMultipleSubraces onChoose={onChooseMock} />);
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

			render(<OnlyRace onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith();
		});

		it('is called with subrace when only 1 subrace', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithOneSubrace onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith('hill-dwarf');
		});

		it('is called with subrace when multiple subraces', async () => {
			const onChooseMock = jest.fn();

			render(<RaceWithMultipleSubraces onChoose={onChooseMock} />);
			await userEvent.tab();
			await userEvent.keyboard(' ');
			await userEvent.tab();
			await userEvent.tab();
			await userEvent.keyboard(' ');

			expect(onChooseMock).toHaveBeenCalledWith('mountain-dwarf');
		});
	});
});
