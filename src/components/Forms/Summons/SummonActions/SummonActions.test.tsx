import { render, screen } from '@testing-library/react';
import * as stories from './SummonActions.stories';
import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const { Actions, BonusActions, Reactions, SpecialAbilities } =
	composeStories(stories);

describe('renders correctly', () => {
	it('for actions', () => {
		render(<Actions />);

		expect(screen.getByTestId('summon-actions')).toMatchSnapshot();
	});

	it('for bonus actions', () => {
		render(<BonusActions />);

		expect(screen.getByTestId('summon-actions')).toMatchSnapshot();
	});

	it('for reactions', () => {
		render(<Reactions />);

		expect(screen.getByTestId('summon-actions')).toMatchSnapshot();
	});

	it('for special abilities', () => {
		render(<SpecialAbilities />);

		expect(screen.getByTestId('summon-actions')).toMatchSnapshot();
	});
});

it('add button works as expected', async () => {
	render(<Actions />);

	for (let i = 0; i < 4; ++i) {
		await userEvent.click(screen.getByText(/add action/i));

		expect(screen.getAllByTestId('summon-action')).toHaveLength(i + 2);
	}

	expect(screen.queryByText(/add action/i)).not.toBeInTheDocument();
});

describe('remove button works as expected', () => {
	it('for actions', async () => {
		render(<Actions />);

		expect(screen.queryByText(/remove action/i)).not.toBeInTheDocument();

		await userEvent.click(screen.getByText(/add action/i));

		expect(screen.getAllByText(/remove action/i).at(0)).toBeInTheDocument();

		await userEvent.click(screen.getByText(/add action/i));

		await userEvent.click(
			screen.getAllByText(/remove action/i).at(0) as HTMLElement
		);

		expect(screen.getAllByTestId('summon-action')).toHaveLength(2);
	});

	it('for everything else', async () => {
		render(<SpecialAbilities />);

		await userEvent.click(screen.getByText(/add special ability/i));

		expect(screen.getByText(/remove special ability/i)).toBeInTheDocument();

		await userEvent.click(screen.getByText(/add special ability/i));
		await userEvent.click(screen.getByText(/add special ability/i));

		await userEvent.click(
			screen.getAllByText(/remove special ability/i).at(0) as HTMLElement
		);

		expect(screen.getAllByTestId('summon-action')).toHaveLength(2);
	});
});
